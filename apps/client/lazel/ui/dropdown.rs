use gpui::*;

use super::button::make_button;

pub struct Dropdown {
    pub trigger: String,
    pub contents: Vec<AnyElement>,
    pub open: bool,
    pub on_open_change: Box<dyn Fn(&bool, &mut WindowContext) + 'static>,
}

impl RenderOnce for Dropdown {
    fn render(self, _: &mut WindowContext) -> impl IntoElement {
        let callback = self.on_open_change;
        let trigger = make_button()
            .relative()
            .on_mouse_down(MouseButton::Left, move |_, cx| {
                callback(&!self.open, cx);
            })
            .child(self.trigger);

        if self.open {
            let contents = div()
                .flex()
                .flex_col()
                .shadow_md()
                .absolute()
                .bg(rgb(0xf0f0f0))
                .right_0()
                .top(DefiniteLength::Fraction(1.0))
                .mt_1()
                .min_w_auto()
                .border_1()
                .border_color(rgb(0x000000))
                .children(self.contents);
            trigger.child(deferred(contents))
        } else {
            trigger
        }
    }
}
