; (function () {
    'use strict';

    window.biaoDrop = {
        boot
    };

    let defaultConfig = {
        display: 'name',
    };

    /**
     * 启动
     *
     * @param {string} selector - Dropdown 的容器选择器
     * @param {Array} list - 用于渲染的数据
     * @param {Object} config 其他配置项
     */
    function boot(selector, list, config) {
        // 找到 Drop 的容器
        let container = document.querySelector(selector);
        // 缓存 list
        container.$list = list;
        config = Object.assign({}, defaultConfig, config);

        // 准备
        prepare(container);
        // 默认隐藏 list
        setListVisible(container, false);
        // 渲染页面
        render(container, list, config);

        // 绑定事件们
        bindFocus(container, config);
        bindClick(container);
        bindSelect(container, config);
        bindSearch(container, config);
    }

    /**
     * 准备基础页面
     * @param {*} container
     */
    function prepare(container) {
        // 填充基础 html 结构
        container.innerHTML = `
                                <div class="dropdown">
                                    <div class="filter">
                                        <input type="search">
                                    </div>
                                    <div class="list"></div>
                                </div>
                            `;
        // 把 list(存放数据的元素) 缓存到 container 中（把 list 缓存到 mian 中）
        container._list = container.querySelector('.list');
        container._input = container.querySelector('[type=search]');
    }

    /**
     * 渲染 数据
     *
     * @param {string} container
     * @param {Array} list
     */
    function render(container, list, config) {
        // 选中已缓存的 list 元素
        let el = container._list;
        // 每次渲染前清空
        el.innerHTML = '';
        // 循环每条数据
        // 如 list = [{id:1, name:'whh'}, {id:2, name:'lsd'}, {id:3, name:'zks'}]
        // it 就是其中每一条数据
        list.forEach(it => {
            // 创建包含 it 的元素
            // 添加 类名
            // 得到 <div class="item"> </div>
            let item = document.createElement('div');
            item.classList.add('item');

            // 填充 item
            item.innerText = it[config.display];

            // 把每条数据缓存到 item 元素中
            item.$data = it;

            // 把填充好的 item 插入到 list 元素中
            el.appendChild(item);
        });
    }

    /**
     * 当选择 list 时
     * @param {HTMLElement} container
     * @param {Object} config
     */
    function bindSelect(container, config) {
        // 找到 config
        let onSelect = config.onSelect;
        let input = container._input;

        // 给每个 list 绑定点击事件
        container._list.addEventListener('click', e => {
            // 根据被点击的 list 获取相对应数据
            let data = e.target.$data;

            // 搜索框的内容填入相应的 list
            input.value = data[config.display];

            // 隐藏 list 列表
            setListVisible(container, false);

            // 如果有 onSelect 则执行
            onSelect && onSelect(data);
        });
    }

    /**
     * 绑定 搜索 事件 - 在 ipnut 中键盘抬起
     * @param {HTMLElement} container
     * @param {Object} config
     */
    function bindSearch(container, config) {
        // 缓存
        let input = container._input;
        let list = container.$list;

        // 当用户开始输入时
        input.addEventListener('keyup', e => {
            // 显示 list 列表
            setListVisible(container, true);

            // 取到用户输入的关键词
            let keyword = input.value;

            // 过滤数据
            // .filter() 用法
            //  ↓ 原始数组                       ↓ 过滤条件      ↓ 符合条件的新数组
            // [1, 2, 3].filter(num => {return num > 1}) ==> [2, 3]
            let filtered = list.filter(it => {
                // 如果 config.display 为 'name',关键词是 'sd':
                // it.name.includes('lsd')
                return it[config.display].includes(keyword);
            });

            // 重新渲染过滤后的数据
            render(container, filtered, config);
        });
    }

    /**
     * 当搜索框聚焦时
     * @param {HTMLElements} container
     */
    function bindFocus(container) {
        container._input.addEventListener('focus', e => {
            // 显示列表
            setListVisible(container, true);
        });
    }

    /**
     * 当插件被点击时
     * @param {HTMLElement} container
     */
    function bindClick(container) {
        container.addEventListener('click', e => {
            // 如果点的是插件内部则返回
            if (e.target.closest('.dropdown'))
                return;

            // 否则隐藏选项列表
            setListVisible(container, false);
        });
    }

    /**
     * 设置 显示/隐藏
     * @param {HTMLElement} container
     * @param {boolean} [visible=true] - 是否可见
     */
    function setListVisible(container, visible = true) {
        container._list.hidden = !visible;
    }

})();