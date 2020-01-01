
<div id="incp-app-specls-s6r-alert" class="alert alert-warning" style="display:none">No more results ...</div>

<table width="100%">
  <tr>
    <td>
      <form id="incp-app-specls-s6r-qry" action="#" class="form-inlines">
        <input id="incp-app-specls-s6r-qry-text" type="text"
          class="form-control incp-app-list-qry-input" 
          placeholder="Press Enter to Search" 
          value="">
      </form>
    </td>
  </tr>
</table>

<table class="table table-hover valign-middle">
  <thead>
    <tr>
      <th>ID</th>
      <th>User</th>
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="incp-app-specls-s6r"></tbody>
</table>

<script id="incp-app-specls-s6r-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td>{[=v.meta.id]}</td>
  <td>{[=v.meta.user]}</td>
  <td>{[=l4i.UnixMillisecondFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="btn btn-default btn-sm" onclick="incp_app_specls_selector_on('{[=v.meta.id]}')">Select</button>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">

$("#incp-app-specls-s6r-qry").submit(function(event) {
    event.preventDefault();
    inCpAppSpec.ListRefresh("incp-app-specls-s6r");
});

function incp_app_specls_selector_on(id) {
    if (l4iModal.CurOptions.fn_selector) {
        l4iModal.CurOptions.fn_selector(null, id);
    }
}

inCpAppSpec.ListRefresh("incp-app-specls-s6r");


</script>
