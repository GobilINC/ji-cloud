import {renderTemplate as tmpl} from "@utils/template";
import {appendId, toggleClassesId, setTextId} from "@utils/dom";
import categoriesPage from "@templates/categories/categories-page.html";
import categoryMainSelected from "@templates/categories/category_main_selected.html";
import categoryMainDeselected from "@templates/categories/category_main_deselected.html";
import categorySub from "@templates/categories/category_sub.html";
import categoryLabelDisplay from "@templates/categories/category_label_display.html";
import categoryLabelInput from "@templates/categories/category_label_input.html";

export default {
  title: 'Categories',
}

export const SingleItem = () => {
    const page = tmpl(categoriesPage, {});
    
    appendId(page, "list", setLabel(tmpl(categoryMainDeselected), "deselected")); 
    appendId(page, "list", setLabel(tmpl(categoryMainSelected), "selected")); 
    return page;
}

export const MultiItem = () => {
    const page = tmpl(categoriesPage, {});
    appendId(page, "list", createTree(false));
    appendId(page, "list", createTree(true));
    return page;
}

export const WithMenu = () => {
    const page = tmpl(categoriesPage, {});

    const element = setLabel(tmpl(categoryMainSelected), "with menu");
    appendId(page, "list", toggleClassesId(element, "menu", ["hidden"], false));

    return page;
}

function setLabel(parentElement, label) {

    const element = tmpl(categoryLabelDisplay);
    element.innerText = label;

    return appendId(parentElement, "label", element);
}
function createTree(selected) {
    const subItems = [
        setLabel(tmpl(categorySub), "sub item 1"),
        setLabel(tmpl(categorySub), "sub item 2"),
    ];

    subItems.forEach(subItem => {
        const subSubItems = [
            setLabel(tmpl(categorySub), "sub item A"),
            setLabel(tmpl(categorySub), "sub item B"),
        ];
        subSubItems.forEach(subSubItem => {
            appendId(subItem, "children", subSubItem);
        });
    });

    const mainItem = selected 
        ? setLabel(tmpl(categoryMainDeselected), "deselected")
        : setLabel(tmpl(categoryMainSelected), "selected");

    subItems.forEach(subItem=> {
        appendId(mainItem, "children", subItem);
    });

    return mainItem;
}