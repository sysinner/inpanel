<div id="incp-config-instance-alert" class="alert" style="display:none"></div>

<div id="incp-config-instance"></div>

<script id="incp-config-instance-tpl" type="text/html">
<table class="incp-formtable">
<tbody>
{[~it.fields :v]}

{[if (v.type == 1) {]}
<tr>
  <td width="220px">{[=v.name]}</td>
  <td>
    <input name="fn_{[=v.name]}" class="form-control incp-config-instance-item" value="{[=v._value]}" {[? v.auto_fill && v.auto_fill.length > 0]}readonly="readonly"{[?]}>
    {[? v.description && v.description.length > 0]}
    <small>{[=v.description]}</small>
    {[?]}
  </td>
</tr>
{[}]}

{[if (v.type == 3 || (v.type >= 300 && v.type <= 399)) {]}
<tr>
  <td width="220px">{[=v.name]} {[? v._readOnly === true]}<br>(Read Only){[?]}</td>
  <td>
    <textarea id="fn_{[=v.name]}" name="fn_{[=v.name]}" class="form-control incp-config-instance-item" {[? v.auto_fill && v.auto_fill.length > 0]}readonly="readonly"{[?]} rows="{[? v._textRows]}{[=v._textRows]}{[??]}4{[?]}">{[=v._value]}</textarea>
    {[? v.description && v.description.length > 0]}
    <small>{[=v.description]}</small>
    {[?]}
  </td>
</tr>
{[}]}
{[~]}
</tbody>
</table>

</script>