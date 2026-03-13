'use client';

import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from '@/registry/default/ui/navigation-menu';

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink href="#">
                <div className="text-sm font-medium">Introduction</div>
                <p className="text-sm text-muted-foreground">Learn the basics of the design system.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="text-sm font-medium">Installation</div>
                <p className="text-sm text-muted-foreground">How to install and set up the registry.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink href="#">
                <div className="text-sm font-medium">Button</div>
                <p className="text-sm text-muted-foreground">Interactive button component.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
