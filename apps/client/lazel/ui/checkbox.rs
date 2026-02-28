use gpui::*;

pub struct Checkbox {
    pub checked: bool,
    pub on_change: Box<dyn Fn(&bool, &mut WindowContext) + 'static>,
}

impl RenderOnce for Checkbox {
    fn render(self, _: &mut WindowContext) -> impl IntoElement {
        let callback = self.on_change;
        let checked = self.checked;

        let mut checkbox = div()
            .w(px(16.0))
            .h(px(16.0))
            .bg(rgb(0xffffff))
            .flex()
            .justify_center()
            .items_center()
            .border_1()
            .cursor_pointer()
            .border_color(rgb(0x000000))
            .hover(|style| style.bg(rgb(0xf0f0f0)).cursor_pointer());

        if checked {
            checkbox = checkbox.child(
                svg()
                    .w(px(12.0))
                    .h(px(10.0))
                    .text_color(rgb(0x0000))
                    .path("icons/check.svg"),
            );
        }

        return checkbox.on_mouse_down(MouseButton::Left, move |_, cx| {
            callback(&!checked, cx);
        });
    }
}
