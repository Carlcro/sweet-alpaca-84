import { LayoutProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: LayoutProps) {
  // do something with state here
  return (
    <div class="bg-green-200">
      <Component />
    </div>
  );
}
