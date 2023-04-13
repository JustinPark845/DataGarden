with import <nixpkgs> { };
mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs
    yarn

  ];
}
