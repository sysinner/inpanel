
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

<table class="table table-hover">
  <thead>
    <tr>
      <th>Name</th>
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
      <td>{[=v.meta.name]}</td>
      <td>{[=v.meta.userID]}</td>
      <td>{[=v.meta.updated]}</td>
      <td align="right">
        <a class="spec-item" href="#{[=v.meta.id]}">Select</a>
      </td>
    </tr>
  {[~]}
</script>

<script type="text/javascript">

$("#incp-app-specls-s6r-qry").submit(function(event) {
    event.preventDefault();
    inCpAppSpec.ListRefresh("incp-app-specls-s6r");
});

$("#incp-app-specls-s6r").on("click", ".spec-item", function() {
    var id = $(this).attr("href").substr(1);
    if (l4iModal.CurOptions.fn_selector) {
        l4iModal.CurOptions.fn_selector(null, id);
    }
});

inCpAppSpec.ListRefresh("incp-app-specls-s6r");


</script>
