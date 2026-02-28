use super::scope::Scope;

#[derive(Clone)]
pub struct Label {
    scope: Scope,
    name: String,
}

impl Label {
    pub fn try_from(s: &str) -> Result<Self, &'static str> {
        let mut parts = s.split(':');
        let path = parts.next().ok_or("Missing scope")?;
        let name = parts.next().ok_or("Missing name")?;

        if parts.next().is_some() {
            return Err("Invalid target string: Too many colons");
        }

        Ok(Label {
            scope: Scope::try_from(path)?,
            name: name.to_string(),
        })
    }

    pub fn under_scope(scope: &Scope, name: &str) -> Label {
        Label {
            scope: scope.clone(),
            name: name.to_string(),
        }
    }

    pub fn get_name(&self) -> &str {
        &self.name
    }

    pub fn get_scope(&self) -> &Scope {
        &self.scope
    }

    pub fn stringify(&self) -> String {
        format!("{}:{}", self.scope.stringify(), self.name)
    }
}
