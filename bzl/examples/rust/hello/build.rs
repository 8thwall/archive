fn main() {
    // Note that we add cargo:warning so that we see it when running the `main` binary, else this
    // log is not printed.
    println!("cargo:warning=[build] Hello, world!");
}
