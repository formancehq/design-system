import type { CSSProperties } from 'react';

import type { RowData } from '@tanstack/react-table';

import type { Column } from '@/components/ui-fragments/data-table/data-table-features';

const COLUMN_RULE = '1px solid var(--border)';

export const getCommonPinningStyles = <TData extends RowData>(
  column: Column<TData>,
  isLastRow?: boolean,
  hasStartPinnedColumns?: boolean
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastStartPinnedColumn =
    isPinned === 'start' && column.getIsLastColumn('start');
  const isFirstCenterColumnAfterStartPins =
    hasStartPinnedColumns && !isPinned && column.getIsFirstColumn('center');

  return {
    borderInlineEnd:
      isLastStartPinnedColumn && !column.getIsLastColumn()
        ? COLUMN_RULE
        : undefined,
    borderInlineStart: column.getIsFirstColumn()
      ? undefined
      : isFirstCenterColumnAfterStartPins
        ? 'none'
        : COLUMN_RULE,
    borderBlockEnd: !isLastRow ? COLUMN_RULE : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    ...(isPinned && {
      boxSizing: 'border-box',
      minWidth: column.getSize(),
      maxWidth: column.getSize(),
    }),
    zIndex: isPinned ? 1 : 0,
  };
};
