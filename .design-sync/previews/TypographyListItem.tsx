import {
  TypographyList,
  TypographyListItem,
  TypographyP,
} from '@formance/design-system';

export function InsideList() {
  return (
    <div className="w-full max-w-md">
      <TypographyP>A Formance stack always ships with:</TypographyP>
      <TypographyList>
        <TypographyListItem>
          Ledger — the immutable transaction log
        </TypographyListItem>
        <TypographyListItem>
          Payments — connectivity to your PSPs
        </TypographyListItem>
        <TypographyListItem>
          Auth — OAuth2 and OIDC for every service
        </TypographyListItem>
      </TypographyList>
    </div>
  );
}
