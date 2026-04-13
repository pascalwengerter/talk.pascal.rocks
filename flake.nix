{
  description = "palava p2p-web dev environment";

  inputs = {
    nixpkgs.url = "path:/nix/store/rq25a6xjh70jb85pjk7wr0gzjpi4wqxj-nixpkgs/nixpkgs";
    flake-utils.url = "path:/nix/store/01x5k4nlxcpyd85nnr0b9gm89rm8ff4x-source";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            corepack
          ];

          env.NODE_OPTIONS = "--max-old-space-size=8192";

          shellHook = ''
            echo "palava p2p-web dev shell"
            echo "node: $(node --version)"
            echo "pnpm: $(pnpm --version 2>/dev/null || echo 'run: corepack enable && corepack prepare')"
          '';
        };
      });
}
