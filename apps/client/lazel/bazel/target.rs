use super::{label::Label, scope::Scope};

#[derive(Clone)]
pub enum TargetPattern {
    Single(Label),
    All(Scope),
    Prefix(Scope),
}

impl TargetPattern {
    #[allow(dead_code)]
    pub fn single(label: Label) -> Self {
        TargetPattern::Single(label)
    }

    pub fn all(path: Scope) -> Self {
        TargetPattern::All(path)
    }

    pub fn all_recursive(path: Scope) -> Self {
        TargetPattern::Prefix(path)
    }

    pub fn stringify(&self) -> String {
        match self {
            TargetPattern::Single(label) => label.stringify(),
            TargetPattern::All(path) => format!("{}:all", path.stringify()),
            TargetPattern::Prefix(path) => format!("{}/...", path.stringify()),
        }
    }
}

#[derive(Clone)]
pub enum TargetSpecifier {
    Pattern(TargetPattern),
    NegativePattern(TargetPattern),
}

impl TargetSpecifier {
    #[allow(dead_code)]
    pub fn new(pattern: TargetPattern) -> Self {
        TargetSpecifier::Pattern(pattern)
    }

    pub fn invert(self) -> TargetSpecifier {
        match self {
            TargetSpecifier::Pattern(pattern) => TargetSpecifier::NegativePattern(pattern),
            TargetSpecifier::NegativePattern(pattern) => TargetSpecifier::Pattern(pattern),
        }
    }

    pub fn stringify(&self) -> String {
        match self {
            TargetSpecifier::Pattern(pattern) => pattern.stringify(),
            TargetSpecifier::NegativePattern(pattern) => format!("-{}", pattern.stringify()),
        }
    }
}

impl From<Label> for TargetPattern {
    fn from(label: Label) -> Self {
        TargetPattern::Single(label)
    }
}

impl From<Label> for TargetSpecifier {
    fn from(label: Label) -> Self {
        TargetSpecifier::Pattern(label.into())
    }
}

impl From<Scope> for TargetPattern {
    fn from(scope: Scope) -> Self {
        TargetPattern::all_recursive(scope)
    }
}

impl From<Scope> for TargetSpecifier {
    fn from(scope: Scope) -> Self {
        TargetSpecifier::Pattern(scope.into())
    }
}

impl From<TargetPattern> for TargetSpecifier {
    fn from(pattern: TargetPattern) -> TargetSpecifier {
        TargetSpecifier::Pattern(pattern)
    }
}
