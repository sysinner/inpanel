<div id="incp-appls-selector-alert" class="alert" style="display:none"></div>

<table class="table table-hover">
  <thead>
    <tr>
      <th>App ID</th>
      <th>Name</th>
      <th>Pod</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="incp-appls-selector"></tbody>
</table>

<script id="incp-appls-selector-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">{[=v.meta.id]}</td>
  <td>{[=v.meta.name]}</td>
  <td class="incp-font-fixspace">{[=v.operate.pod_id]}</td>
  <td align="right">
    <button class="btn btn-default btn-sm" onclick="_incp_appls_selector_app('{[=v.meta.id]}')">Select</button>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">

function _incp_appls_selector_app(app_id)
{
    if (l4iModal.CurOptions.fn_selector) {
        l4iModal.CurOptions.fn_selector(null, app_id);
    }
}

</script>
