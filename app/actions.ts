"use server";

const APP_CODE_GRANT = "be36d44aa36bfb5b";
const APP_CODE_ENDFIELD = "endfield";

export async function sendPhoneCode(phone: string) {
    try {
        const response = await fetch("https://as.hypergryph.com/general/v1/send_phone_code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ phone, type: 2 }),
        });

        const data = await response.json();
        return { success: data.status === 0, msg: data.msg };
    } catch (error) {
        console.error("sendPhoneCode error:", error);
        return { success: false, msg: "发送失败" };
    }
}

export async function loginAndFetchUID(phone: string, code: string) {
    try {
        const authResponse = await fetch("https://as.hypergryph.com/user/auth/v2/token_by_phone_code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ phone, code }),
        });

        const authData = await authResponse.json();
        if (authData.status !== 0) {
            return { success: false, msg: authData.msg };
        }

        const token = authData.data.token;
        return await fetchUIDWithToken(token);
    } catch (error) {
        console.error("loginAndFetchUID error:", error);
        return { success: false, msg: "登录或查询失败" };
    }
}

export async function loginByPasswordAndFetchUID(phone: string, password: string) {
    try {
        const authResponse = await fetch("https://as.hypergryph.com/user/auth/v1/token_by_phone_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ phone, password }),
        });

        const authData = await authResponse.json();
        if (authData.status !== 0) {
            return { success: false, msg: authData.msg };
        }

        const token = authData.data.token;
        return await fetchUIDWithToken(token);
    } catch (error) {
        console.error("loginByPasswordAndFetchUID error:", error);
        return { success: false, msg: "登录或查询失败" };
    }
}

async function fetchUIDWithToken(token: string) {
    const grantResponse = await fetch("https://as.hypergryph.com/user/oauth2/v2/grant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            token: token,
            appCode: APP_CODE_GRANT,
            type: 1,
        }),
    });

    const grantData = await grantResponse.json();
    if (grantData.status !== 0) {
        return { success: false, msg: grantData.msg };
    }

    const appToken = grantData.data.token;

    const bindingResponse = await fetch(
        `https://binding-api-account-prod.hypergryph.com/account/binding/v1/binding_list?token=${encodeURIComponent(
            appToken
        )}`,
        { method: "GET" }
    );

    const bindingData = await bindingResponse.json();
    if (bindingData.status !== 0) {
        return { success: false, msg: bindingData.msg };
    }

    const endfieldBinding = bindingData.data.list.find((item: { appCode: string; bindingList: { uid: string }[] }) => item.appCode === APP_CODE_ENDFIELD);
    if (!endfieldBinding || !endfieldBinding.bindingList || endfieldBinding.bindingList.length === 0) {
        return { success: false, msg: "未找到明日方舟：终末地账号" };
    }

    const uid = endfieldBinding.bindingList[0].uid;
    return { success: true, uid };
}
