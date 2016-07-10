let pkgs = import <nixpkgs> {};
in with pkgs; let
    devDependencies = [

    ];
    
    dependencies = [
      nodejs
    ];

in {
    devEnv = stdenv.mkDerivation {
        name = "quick-budget";
        buildInputs = devDependencies ++ dependencies;
    };
}

