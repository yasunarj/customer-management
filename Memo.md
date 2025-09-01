https://chatgpt.com/c/68aec047-4274-832e-80a0-cff4be1d13e6 鮮度商品管理アプリ

・.refine((val) => val.password === val.confirm, {
message: "確認用パスワードが一致しません",
path: ["confirm"],
});
こちらの path: ["confirm"]とは何をしているのでしょうか？

・ useEffect(() => {
(async () => {
const { data } = await supabase.auth.getUser();
if (!data.user) {
router.replace("/auth/forgot-password");
return;
}
setReady(true);
})();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
こちらは
useEffect(() => {
const run = async () => {
const { data } = await supabase.auth.getUser();
if(!data.user) {
router.replace("/auth/forgot-password");
return;
}
setReady(true);
};
run();
}, [router, supabase.auth]);
このコードと同じですか？
・eslint-disable-next-line react-hooks/exhaustive-deps こちらの意味も教えてください。

・ <FormControl>
<Input
type="password"
autoComplete="new-password"
placeholder="新しいパスワード"
{...field}
/>
</FormControl>
こちらのautoCompleteと{...field}の意味を教えてください。

・{form.formState.isSubmitting ? "更新中..." : "更新する"}
こちらは値をsubmit中かどうかを真偽値で表しているんでしょうか？