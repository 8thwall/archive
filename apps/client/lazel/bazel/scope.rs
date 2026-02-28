#[derive(Clone)]
pub struct Scope(String);

impl Scope {
    pub fn stringify(&self) -> String {
        self.0.clone()
    }
}

impl TryFrom<&str> for Scope {
    type Error = &'static str;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        if !s.starts_with("//") && !s.starts_with("@") {
            return Err("Scope must start with // or @");
        }

        for c in s.chars() {
            match c {
                'a'..='z' | 'A'..='Z' | '0'..='9' | '_' | '-' | '/' | ':' => (),
                _ => return Err("Invalid character in path"),
            }
        }

        if s.ends_with("/") {
            return Err("Scope must not end with /");
        }

        Ok(Self(s.to_string()))
    }
}
