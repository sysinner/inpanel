<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title" style="padding: 0 10px;">
    <ul class="incp-nav incp-nav-item-underline" id="inops-sys-config-nav"></ul>
  </div>
  <div class="incp-card-body incp-formtable">
    <div id="inops-sys-config-alert"></div>
    <div id="inops-sys-config-form"></div>
  </div>
</div>
</div>

<script id="inops-sys-config-nav-tpl" type="text/html">
<li class="incp-topbar-brand" style="margin-right: 20px">Settings </li>
{[~it.groups.items :v]}
<li>
  <a href="#" id="inops-sys-config-nav-item-{[=v._gid]}"
    onclick="inOpsSys.ConfigGroup('{[=v.name]}');return false">{[=v.title]}</a>
</li>
{[~]}
</script>

<script id="inops-sys-config-wizard-tpl" type="text/html">

<input type="hidden" name="cfr_name" value="{[=it.configurator.name]}">

<table class="incp-formtable">
<tbody>

{[~it.configurator.fields :v]}
<tr>
  <td width="300px">
    {[=v.title]}
  </td>
  <td></td>
  <td>
    <input name="fn_{[=v.name]}" class="form-control inops-sys-config-item" value="{[=v._value]}" {[if (v.auto_fill && v.auto_fill.length > 0) {]}readonly="readonly"{[}]}>
  </td>
</tr>
{[~]}
<tr>
  <td></td>
  <td></td>
  <td>
    <button class="btn btn-primary" onclick="inOpsSys.ConfigGroupCommit()">{[=l4i.T("Save")]}</button>
  </td>
</tr>

</tbody>
</table>


</script>
