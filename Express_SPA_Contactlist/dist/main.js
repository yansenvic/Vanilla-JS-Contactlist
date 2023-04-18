(() => {
  "use strict";
  var e = {
    d: (t, a) => {
      for (var n in a)
        e.o(a, n) &&
          !e.o(t, n) &&
          Object.defineProperty(t, n, { enumerable: !0, get: a[n] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  function t() {
    const e = 10 * (n.currentPage - 1);
    fetch(
      `https://dummyjson.com/users/search?q=${n.searchValue}&skip=${e}&limit=10`
    )
      .then((e) => e.json())
      .then((e) => {
        o({ contacts: [...e.users], totalData: e.total, errorMassage: "" });
      })
      .catch((e) => {
        o({ contacts: [], errorMassage: e.message, totalData: 0 });
      })
      .finally(() => o({ isLoading: !1 }));
  }
  e.d({}, { H: () => v });
  let a,
    n = {
      path: window.location.pathname,
      contacts: [],
      favContacts: JSON.parse(localStorage.getItem("favContacts")) ?? [],
      searchValue: "",
      searchValueFavorite: "",
      currentPage: 1,
      currentPageFavorite: 1,
      isLoading: !1,
      errorMassage: "",
      totalData: 0,
    };
  function o(e) {
    const t = { ...n },
      a = { ...n, ...e };
    (n = a), c(t, a), v();
  }
  function c(e, n) {
    e.path !== n.path && history.pushState(null, "", n.path),
      e.searchValue !== n.searchValue &&
        (o({ isLoading: !0 }),
        a && clearTimeout(a),
        (a = setTimeout(() => {
          t(), o({ isLoading: !1, currentPage: 1 });
        }, 500))),
      e.searchValueFavorite !== n.searchValueFavorite &&
        o({ currentPageFavorite: 1 }),
      e.currentPage !== n.currentPage && t(),
      e.favContacts !== n.favContacts &&
        localStorage.setItem("favContacts", JSON.stringify(n.favContacts));
  }
  function r(e) {
    const t = document.createElement("a");
    return (
      (t.href = e.pathname),
      (t.textContent = e.label),
      (t.onclick = function (e) {
        e.preventDefault(), o({ path: new URL(e.target.href).pathname });
      }),
      t
    );
  }
  function u() {
    const e = r({ pathname: "/home", label: "Home" }),
      t = r({ pathname: "/favorites", label: "Favorites" }),
      a = document.createElement("div");
    return a.append(e), a.append(" - "), a.append(t), a;
  }
  function i(e) {
    const t = document.createElement("h2");
    return (t.innerText = e), t;
  }
  function l(e) {
    const t = document.createElement("input");
    return (
      (t.type = "text"),
      (t.placeholder = "Enter Name"),
      (t.id = "input"),
      (t.value = e.value),
      (t.oninput = function (t) {
        e.onInput(t.target.value);
      }),
      t
    );
  }
  function s(e) {
    const t = document.createElement("input");
    return (t.type = "button"), (t.value = e.value), (t.onclick = e.onClick), t;
  }
  function m(e) {
    const t = document.createElement("ol");
    t.start = 10 * (e.currentPage - 1) + 1;
    const a = e.data.map((e) => {
      const t = document.createElement("li"),
        a = document.createElement("p"),
        c = document.createElement("p"),
        r = n.favContacts.some((t) => e.id === t.id),
        u = s({
          value: r ? "Delete from Favorite" : "Add to Favorite",
          onClick: r
            ? () => {
                return (
                  (t = e.id),
                  void o({
                    favContacts: n.favContacts.filter(function (e) {
                      return e.id !== Number(t);
                    }),
                  })
                );
                var t;
              }
            : () => {
                o({
                  favContacts: [...n.favContacts, n.contacts[(e.id - 1) % 10]],
                });
              },
        });
      return (
        (a.textContent = e.firstName + " " + e.maidenName + " " + e.lastName),
        (c.textContent = e.email),
        t.append(a, c, u),
        t
      );
    });
    return t.append(...a), t;
  }
  function d(e) {
    const t = Math.ceil(e.totalData / 10);
    let a = document.createElement("div");
    for (let o = 1; o <= t; o++) {
      const t = document.createElement("a"),
        c = o;
      (t.href = n.path),
        (t.textContent = o + " "),
        (t.onclick = function (t) {
          t.preventDefault(), e.onChange(c);
        }),
        a.append(t);
    }
    return a;
  }
  function p() {
    return [
      ...n.favContacts
        .filter(f)
        .slice(10 * (n.currentPageFavorite - 1), 10 * n.currentPageFavorite),
    ];
  }
  function f(e) {
    return (e.firstName + " " + e.maidenName + " " + e.lastName)
      .toLowerCase()
      .match(n.searchValueFavorite.toLowerCase());
  }
  function v() {
    const e = document.getElementById("root"),
      t = (function () {
        const e = (function () {
            const e = u(),
              t = i("Contact List"),
              a = l({
                value: n.searchValue,
                onInput: function (e) {
                  o({ searchValue: e });
                },
              }),
              c = s({
                value: "Clear",
                onClick: () => {
                  o({ searchValue: "" });
                },
              }),
              r = m({ currentPage: n.currentPage, data: n.contacts }),
              p = d({
                totalData: n.totalData,
                onChange: function (e) {
                  o({ currentPage: e });
                },
              }),
              f = document.createElement("div");
            if ((f.append(e, t, a, c), n.isLoading)) {
              const e = document.createElement("p");
              (e.textContent = "Data is Loading"), f.append(e);
            } else if ("" !== n.errorMassage) {
              const e = document.createElement("p");
              (e.textContent = n.errorMassage), f.append(e);
            } else if (n.totalData > 0) f.append(r, p);
            else {
              const e = document.createElement("p");
              (e.textContent = "Data empty"), f.append(e);
            }
            return f;
          })(),
          t = (function () {
            const e = p(),
              t = u(),
              a = i("Favorite Contact List"),
              c = l({
                value: n.searchValueFavorite,
                onInput: function (e) {
                  o({ searchValueFavorite: e });
                },
              }),
              r = s({
                value: "Clear",
                onClick: () => {
                  o({ searchValueFavorite: "" });
                },
              }),
              v = m({ currentPage: n.currentPageFavorite, data: e }),
              h = d({
                totalData: n.favContacts.filter(f).length,
                onChange: function (e) {
                  o({ currentPageFavorite: e });
                },
              }),
              g = document.createElement("div");
            if ((g.append(t, a, c, r), p().length > 0)) g.append(v, h);
            else {
              const e = document.createElement("p");
              (e.textContent = "Data empty"), g.append(e);
            }
            return g;
          })();
        return "/home" === n.path || "/" === n.path
          ? e
          : "/favorites" === n.path
          ? t
          : void 0;
      })();
    let a, c, r;
    if (
      ("text" === document.activeElement.type &&
        ((a = document.activeElement.id),
        (c = document.activeElement.selectionStart),
        (r = document.activeElement.selectionEnd)),
      (e.innerHTML = ""),
      e.append(t),
      a)
    ) {
      const e = document.getElementById(a);
      e.focus(), (e.selectionStart = c), (e.selectionEnd = r);
    }
  }
  v(), c({}, n);
})();
