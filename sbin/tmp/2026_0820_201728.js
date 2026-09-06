#!run
import {r} from "@hoge1e3/dom-ref";
import {ref} from "@hoge1e3/ref";

export async function main() {
  return this.widget(wmain);
}

function wmain({id: idgen, t}) {
  /*
  `idgen.name` -> "idOfThisWidget-name"
  `idgen()` -> a new id beginning with "idOfThisWidget-"
  `t` is the DOM tag generator.
  `r(refobj, render)` rerenders when `refobj` changes.
  */
  const Item = (count = 0, id = idgen()) => ({
    count,
    id,
    inc: () => Item(count + 1, id),
  });
  const itemRef = () => ref(Item());
  const itemrsr = ref([itemRef()]);
  const b = (c, a) => t.button({onclick: a}, c);

  return t.div(
    t.h1("test"),
    r(itemrsr, (itemrs) =>
      t.div(
        {id: idgen.items},
        ...itemrs.map((itemr) =>
          r(itemr, (item) =>
            t.div(
              {id: idgen[item.id]},
              t.span(item.count),
              b("inc", () => (itemr.value = item.inc())),
              b("del", () =>
                (itemrsr.value = itemrsr.value.filter((e) => e !== itemr))
              )
            )
          )
        )
      )
    ),
    b("add", () => (itemrsr.value = [...itemrsr.value, itemRef()]))
  );
}
