use std::rc::Rc;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use futures_signals::{
    map_ref,
    signal::{Mutable, SignalExt, Signal},
    signal_vec::{MutableVec, SignalVecExt},
    CancelableFutureHandle, 
};
use web_sys::{HtmlElement, Element, HtmlInputElement};
use dominator::{DomBuilder, Dom, html, events, clone, apply_methods};
use dominator_helpers::{elem, with_data_id, spawn_future, AsyncLoader};
use crate::templates;
use wasm_bindgen_futures::{JsFuture, spawn_local, future_to_promise};
use futures::future::ready;
use crate::data::*;
use crate::debug;
use utils::components::module_page::*;
use async_trait::async_trait;
use super::{sidebar, main::MainDom, header, footer};

pub struct EditorPage {
    pub state: Rc<State>,
}

impl EditorPage {
    pub fn new(jig_id: String, module_id: String) -> Rc<Self> {
        let state = Rc::new(State::new(jig_id, module_id));
        Rc::new(Self { state })
    }
}

#[async_trait(?Send)]
impl ModuleRenderer for EditorPage {
    type Data = raw::Poster;

    async fn load(_self:Rc<Self>) -> raw::Poster { 
        if let Some(raw_poster) = debug::settings().poster {
            raw_poster
        } else {
            raw::Poster::load(_self.state.jig_id.clone(), _self.state.module_id.clone()).await
        }
    }

    fn render(_self: Rc<Self>, data: raw::Poster) -> ModuleRenderOutput {
        _self.state.set_from_loaded(data);
        ModuleRenderOutput {
            kind: ModulePageKind::EditResize,
            sidebar: Some(sidebar::render(_self.state.clone())),
            header: Some(header::render(_self.state.clone())),
            main: Some(MainDom::render(MainDom::new(_self.state.clone()))),
            footer: Some(footer::render(_self.state.clone())),
        }
    }

}
