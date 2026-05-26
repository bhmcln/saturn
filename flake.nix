{
  description = "Saturn — shadcn/ui-style library of time-based UI components";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            pnpm_10
            git
          ];

          shellHook = ''
            if [ ! -d node_modules ] && [ -f pnpm-workspace.yaml ]; then
              echo "📦 Run 'pnpm install' to fetch workspace dependencies."
            fi
          '';
        };
      }
    );
}
