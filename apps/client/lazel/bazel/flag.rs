#[derive(Clone)]
pub enum Flag {
    KV(String, String),
    K(String),
}

impl Flag {
    pub fn k(k: &str) -> Self {
        Flag::K(k.to_string())
    }

    pub fn kv(k: &str, v: &str) -> Result<Self, ()> {
        if k.contains("'") {
            eprintln!("Invalid flag, cannot include single quote");
            return Err(());
        }
        Ok(Flag::KV(k.to_string(), v.to_string()))
    }

    pub fn stringify(&self) -> String {
        match self {
            Flag::KV(k, v) => format!("--{}='{}'", k, v),
            Flag::K(k) => {
                if k.len() == 1 {
                    format!("-{}", k)
                } else {
                    format!("--{}", k)
                }
            }
        }
    }
}
