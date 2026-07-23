import React from 'react';
import { TableProAction } from './TableProAction';

const DATABASE_CONNECT_HOOK = 'SiteInfoDatabase_TableList_TableListRow[Connect]:Before';

export default function registerRenderer(context: any): void {
  context.hooks.addContent(DATABASE_CONNECT_HOOK, (site: any) => (
    <TableProAction key={`tablepro-${site.id}`} site={site} />
  ));
}
