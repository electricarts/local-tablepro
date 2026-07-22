import React from 'react';

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
	TABLEPRO_BUNDLE_ID,
	TABLEPRO_SOCKET_PATH,
	buildConnectionURL,
	ensureSocketSymlink,
} = require('./connection');

export default class TablePro extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			disabled: true,
			hasError: false,
			opening: false,
		};
		this.updateTimer = null;
		this.mounted = false;
	}

	componentDidMount () {
		this.mounted = true;
		this.props.context.hooks.addAction('siteStarted', () => this.updateState());
		this.props.context.hooks.addAction('siteStopped', () => this.updateState());
		this.updateState();
		this.updateTimer = setInterval(() => this.updateState(), 1000);
	}

	componentWillUnmount () {
		this.mounted = false;
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
		}
	}

	getSocketLockFile () {
		return path.join(
			this.props.context.environment.userDataPath,
			'run',
			this.props.site.id,
			'mysql',
			'mysqld.sock.lock'
		);
	}

	getSocketFile () {
		return path.join(
			this.props.context.environment.userDataPath,
			'run',
			this.props.site.id,
			'mysql',
			'mysqld.sock'
		);
	}

	getApplicationPaths () {
		const userHome = this.props.context.environment.userHome || '';

		return [
			'/Applications/TablePro.app',
			'/Applications/Setapp/TablePro.app',
			path.join(userHome, 'Applications', 'TablePro.app'),
		];
	}

	hasTablePro () {
		return this.getApplicationPaths().some((applicationPath) => fs.existsSync(applicationPath));
	}

	isSiteRunning () {
		return fs.existsSync(this.getSocketLockFile());
	}

	canConnect () {
		return process.platform === 'darwin'
			&& this.hasTablePro()
			&& this.isSiteRunning();
	}

	updateState () {
		if (!this.mounted) {
			return;
		}

		const disabled = !this.canConnect();

		if (disabled !== this.state.disabled) {
			this.setState({ disabled });
		}
	}

	openTablePro () {
		if (!this.canConnect() || this.state.opening) {
			return;
		}

		let connectionURL;

		try {
			const socketResult = ensureSocketSymlink(this.getSocketFile(), TABLEPRO_SOCKET_PATH);
			if (!socketResult.ok) {
				throw socketResult.error;
			}

			connectionURL = buildConnectionURL(this.props.site);
		} catch (error) {
			console.error('[local-tablepro]', error);
			this.setState({ hasError: true });
			return;
		}

		this.setState({ opening: true, hasError: false });
		execFile('/usr/bin/open', ['-b', TABLEPRO_BUNDLE_ID, connectionURL], (error) => {
			if (error) {
				console.error('[local-tablepro] Could not open TablePro.', error);
			}

			if (this.mounted) {
				this.setState({ opening: false, hasError: Boolean(error) });
			}
		});
	}

	buttonStyle () {
		const color = this.state.hasError
			? '#ff6b6b'
			: (this.state.disabled ? '#d5d5d5' : '#55c987');

		return {
			background: 'transparent',
			border: 0,
			color,
			cursor: this.state.disabled ? 'default' : 'pointer',
			font: 'inherit',
			'font-weight': 600,
			'margin-right': 25,
			opacity: 1,
			padding: 0,
		};
	}

	render () {
		return (
			<button
				type="button"
				disabled={this.state.disabled || this.state.opening}
				style={this.buttonStyle()}
				onClick={() => this.openTablePro()}
				title={this.state.hasError ? 'TablePro could not be opened. See Developer Tools for details.' : ''}
			>
				{this.state.opening ? 'Opening TablePro…' : 'Open TablePro'}
			</button>
		);
	}
}
