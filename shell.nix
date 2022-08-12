with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "install-bin";

  buildInputs = [
    nodejs
    yarn
  ];
}
