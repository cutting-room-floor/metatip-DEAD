# metatip

Tooltips on maps for fancy people.

### example

```js
gjLayer.on('click', metatip().config({
    fields: [
        {
            key: 'name',
            elem: 'h3'
        },
        {
            key: 'density',
            label: true,
            elem: 'h1'
        }
    ]
}));
```
