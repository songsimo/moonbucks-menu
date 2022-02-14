export class MenuApp {
    constructor() {
        const MIN_SPLICE = 1;
        let menuItems = [];

        let menuTitle = new MenuTitle();

        let menuList = new MenuList({
            onUpdate(index, contents) {
                const newMenuItem = new MenuItems(contents);
                menuItems[index] = newMenuItem;
                setState(menuItems);
            },
            onDelete(index) {
                menuItems.splice(index, MIN_SPLICE);
                setState(menuItems);
            }
        });

        new MenuInput({
            onAdd(contents) {
                const newMenuItem = new MenuItems(contents);
                menuItems.push(newMenuItem);
                setState(menuItems);
            },
        });

        const setState = (updatedItems) => {
            this.menuItems = updatedItems;
            menuTitle.setState(menuItems);
            menuList.setState(menuItems);
        };
    }
}

class MenuItems {    
    constructor(contents) {
        this.name = contents;
    }

    getName() {
        return this.name;
    }
}

class MenuTitle {
    constructor() {
        const $menuCountSpan = document.getElementById('menu-count');
        let itemCount = 0;

        this.setState = (updatedItems) => {
            itemCount = updatedItems.length;
            this.render(itemCount);
        };

        this.render = (itemCount) => {
            $menuCountSpan.innerHTML = `총 ${ itemCount }개`;
        };
    }
}

class MenuInput {
    constructor({ onAdd }) {
        const $menuInput = document.getElementById('espresso-menu-name');
        const $menuAddButton = document.getElementById('espresso-menu-submit-button');

        $menuInput.addEventListener('keydown', (event) => this.addMenuItem(event));
        $menuAddButton.addEventListener('click', (event) => this.addMenuItem(event));

        this.addMenuItem = (event) => {
            if (isValid(event, $menuInput.value)) {
                onAdd($menuInput.value);
                $menuInput.value = '';
            }
        };

        const isValid = (event, value) => {
            const ENTER_CODE = 13;
            const CLICK_TYPE = 'click';

            const eventType = event.keyCode || event.type;

            if (eventType === ENTER_CODE || eventType === CLICK_TYPE) {
                event.preventDefault();

                if (value) {
                    return true;
                }
            }

            return false;
        };
    }
}

class MenuList {
    constructor({ onUpdate, onDelete }) {
        const $menuList = document.getElementById('espresso-menu-list');

        let menuItems = [];

        this.setState = (updatedMenuItems) => {
            menuItems = updatedMenuItems;
            this.render(menuItems);
        };

        this.render = (items) => {
            const template = items.map((x, index) => menuItemTemplate(index, x.getName()));
            $menuList.innerHTML = template.join('');

            this.addMenuListEditEventListener();
            this.addMenuListRemoveEventListener();
        };

        this.addMenuListEditEventListener = () => {
            const $menusEdits = document.querySelectorAll('.menu-edit-button');

            for(let $menuItem of $menusEdits) {
                $menuItem.addEventListener('click', function() {
                    const $menuListItem = this.closest('.menu-list-item');
                    const $menuItemSpan = $menuListItem.querySelector('.menu-name');

                    let itemName = prompt('메뉴명을 수정하세요', $menuItemSpan.innerHTML);

                    if(itemName) {
                        onUpdate($menuListItem.dataset.menuId, itemName);
                    }                    
                });
            }
        };

        this.addMenuListRemoveEventListener = () => {
            const $menusRemoves = document.querySelectorAll('.menu-remove-button');

            for(let $menuItem of $menusRemoves) {
                $menuItem.addEventListener('click', function() {
                    const $menuListItem = this.closest('.menu-list-item');

                    let isConfirm = confirm('정말 삭제하시겠습니까?');

                    if(isConfirm) {
                        onDelete($menuListItem.dataset.menuId);
                    }
                });
            }
        };
    }
}

const menuItemTemplate = function (index, name) {
    return `
        <li data-menu-id=${ index } class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${ name }</span>
            <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
            <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
            <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제</button>
        </li>
        `;
};

export default MenuApp;