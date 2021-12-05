import Vue from 'vue'
import { NavBar, Form, Field, Button, Toast, Tabbar, TabbarItem, Image as VanImage } from 'vant';
import { Col, Row } from 'vant';
import { Icon } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Dialog } from 'vant';
import { Popup } from 'vant';
import { DatetimePicker } from 'vant';
import { Uploader } from 'vant';
import { Tab, Tabs } from 'vant';
import { List } from 'vant';
import { Grid, GridItem } from 'vant';
import { PullRefresh } from 'vant';
import { Divider } from 'vant';
import { ActionSheet } from 'vant';
import { Search } from 'vant';

Vue.use(Search);

Vue.use(ActionSheet);
Vue.use(Divider);

Vue.use(PullRefresh);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Uploader);
Vue.use(DatetimePicker);
Vue.use(Popup)

// 全局注册
Vue.use(Dialog);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);
Vue.use(Col);
Vue.use(Row);
Vue.use(VanImage);
Vue.use(Tabbar);
Vue.use(TabbarItem)
Vue.use(Toast);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(NavBar);