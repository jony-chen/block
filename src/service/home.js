// 导入axios实例
import axios from "axios";

// let url = "http://e.cubitchain.org";
let url = "https://block-7g4irevldbc2bb00-1302893429.ap-shanghai.app.tcloudbase.com";//云开发测试地址
class Home {
    postRegister(username,password) {
        return axios({
            method: 'POST',
            url: url + '/register',
            data: { "username": username, "password": password}
        });
    }
    postLogin(username,password) {
        return axios({
            method: 'POST',
            url: url + '/login',
            data: { "username": username, "password": password}
        });
    }
    uploadLdr(part,color) {
        return axios({
            method: 'POST',
            url: url + '/uploadldr',
            data: { "part": part, "color": color }
        });
    }
    // uploadLdr(item) {
    //     return axios({
    //         method: 'POST',
    //         url: url + '/uploadldr',
    //         // headers: {'Content-Type': 'multipart/form-data'},
    //         data: { "item": item }
    //     });
    // }
    getPartList(action,skip,limit) {
        return axios({
            method: 'POST',
            url: url + '/getpartlist',
            data: { "action": action, "skip": skip, "limit": limit}
        });
    }
    getAddress(action,username,name,phone,address) {
        return axios({
            method: 'POST',
            url: url + '/address',
            data: { "action": action, "username": username,  "deliveryname": name, "deliveryphone": phone, "deliveryaddress": address}
        });
    }
    order(username,name,phone,address,part,pcs,total) {
        return axios({
            method: 'POST',
            url: url + '/order',
            data: { "username": username,  "deliveryname": name, "deliveryphone": phone, "deliveryaddress": address, "batchPart": part, "pcs": pcs, "total": total}
        });
    }
    myorder(username,status) {
        return axios({
            method: 'POST',
            url: url + '/myorder',
            data: { "username": username, "status": status}
        });
    }
    admin(action,username,password,code,data) {
        return axios({
            method: 'POST',
            url: url + '/admin',
            data: { "action": action, "username": username, "password": password, "code": code, "data": data}
        });
    }
    cart(action,username,data) {
        return axios({
            method: 'POST',
            url: url + '/cart',
            data: { "action": action, "username": username, "data": data}
        });
    }
}

export default new Home();
