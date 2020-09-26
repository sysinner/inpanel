<div id="incp-app-specls-alert" class="alert"></div>

<div class="incp-div-light">
<table class="table table-hover valign-middle">
  <thead>
    <tr>
      <th>Spec</th>
      <th>Owner</th>
      <th>Depends</th>
      <th>Packages</th>
      <th>Config</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="incp-app-specls"></tbody>
</table>
</div>

<script id="incp-app-specls-tpl" type="text/html">  
{[~it.items :v]}
<tr id="app-spec-{[=v.meta.id]}-row">
  <td class="incp-font-fixspace">
    <a href="#app/spec/info" onclick="inCpAppSpec.Info('{[=v.meta.id]}')">{[=v.meta.id]}</a> v{[=v.meta.version]}
  </td>
  <td>{[=v.meta.user]}</td>
  <td>{[=v.depends.length]}</td>
  <td>{[=v._ipm_num]}</td>
  <td>
    <button class="btn btn-sm btn-outline-primary"
      onclick="inCpAppSpec.CfgSet('{[=v.meta.id]}')">
      {[=v.configurator.fields.length]}
    </button>
  </td>
  <td align="right">
    {[if (v.meta.user == inCp.UserSession.username) {]}
    <button class="btn btn-sm btn-outline-primary" onclick="inCpAppSpec.Set('{[=v.meta.id]}')">
      <span class="fa fa-edit"></span>
      Modify
    </button>
    {[}]}
    <button class="btn btn-sm btn-outline-primary" onclick="inCpApp.InstNew('{[=v.meta.id]}')">
      <span class="fa fa-cloud-upload-alt"></span>
      New Instance
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">
$("#incp-app-specls-qry").submit(function(event) {
    event.preventDefault();
    inCpAppSpec.ListRefresh("incp-app-specls");
});
</script>


<script type="text/html" id="incp-app-specls-optools">
<!--<li>
  <form action="#" class="form-inlines">
    <input id="query_text" type="text"
      class="form-control incp-query-input" 
      placeholder="Press Enter to Search" 
      value="">
  </form>
</li>-->
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpAppSpec.Set()">
     New AppSpec
  </a>
</li>
</script>
