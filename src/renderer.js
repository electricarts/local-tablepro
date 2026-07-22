import React from 'react';
import TablePro from './TablePro.js';

module.exports = function (context) {
	context.hooks.addContent(
		'SiteInfoDatabase_TableList_TableListRow[Connect]:Before',
		(site) => <TablePro key="tablepro" site={site} context={context} />
	);
};
