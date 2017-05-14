<div id="loscp-appls-selector-alert" class="alert" style="display:none"></div>

<table class="table table-hover">
  <thead>
    <tr>
      <th>App ID</th>
      <th>Name</th>
      <th>Pod</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="loscp-appls-selector"></tbody>
</table>

<script id="loscp-appls-selector-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="loscp-font-fixspace">{[=v.meta.id]}</td>
  <td>{[=v.meta.name]}</td>
  <td class="loscp-font-fixspace">{[=v.operate.pod_id]}</td>
  <td align="right">
    <buttona class="btn btn-default btn-xs" onclick="_loscp_appls_selector_app('{[=v.meta.id]}')">Select</a>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">

function _loscp_appls_selector_app(app_id)
{
    if (l4iModal.CurOptions.fn_selector) {
        l4iModal.CurOptions.fn_selector(null, app_id);
    }
}

</script>
