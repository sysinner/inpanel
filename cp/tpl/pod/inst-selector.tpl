<table class="table table-hover">
  <thead>
    <tr>
      <th>Pod ID</th>
      <th>Name</th>
      <th>Location</th>
      <th>Action</th>
      <th></th>
    </tr>
  </thead>

  <tbody id="incp-podls-selector"></tbody>
</table>

<div id="incp-podls-selector-alert" class="alert"></div>

<script id="incp-podls-selector-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">{[=v.meta.id]}</td>
  <td style="width:30%;">{[=v.meta.name]}</td>
  <td>{[=v.spec.zone]}/{[=v.spec.cell]}</td>
  <td>{[=inCp.OpActionTitle(v.operate.action)]}</td>
  <td align="right">
    <buttona class="btn btn-default btn-xs" onclick="_incp_podls_selector_pod('{[=v.meta.id]}')">Select</a>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">

function _incp_podls_selector_pod(id)
{
    if (l4iModal.CurOptions.fn_selector) {
        l4iModal.CurOptions.fn_selector(null, id);
    }
}
</script>
