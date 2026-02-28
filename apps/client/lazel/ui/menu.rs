use gpui::*;

pub struct MenuItem {
    pub label: String,
    pub action: Box<dyn Fn(&MouseDownEvent, &mut WindowContext) + 'static>,
}

impl RenderOnce for MenuItem {
    fn render(self, _: &mut WindowContext) -> impl IntoElement {
        let action = self.action;

        div()
            .child(self.label.clone())
            .px_2()
            .py_1()
            .cursor_pointer()
            .on_mouse_down(MouseButton::Left, move |event, cx| {
                action(event, cx);
            })
    }
}

pub struct Menu {
    pub items: Vec<MenuItem>,
}

impl RenderOnce for Menu {
    fn render(self, cx: &mut WindowContext) -> impl IntoElement {
        let mut container = div().flex().flex_col().items_center().gap_1().flex_wrap();

        for item in self.items {
            container = container.child(item.render(cx));
        }

        container
    }
}
