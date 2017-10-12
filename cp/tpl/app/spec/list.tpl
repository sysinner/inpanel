<div id="incp-app-specls-alert" class="alert"></div>

<div class="incp-div-light">
<table class="table table-hover">
  <thead>
    <tr>
      <th>Name</th>
      <th>Version</th>
      <th>Owner</th>
      <th>Depends</th>
      <th>Packages</th>
      <th>Executors</th>
      <th>Config</th>
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="incp-app-specls"></tbody>
</table>
</div>

<script id="incp-app-specls-tpl" type="text/html">  
{[~it.items :v]}
<tr>
  <td>
    <a href="#app/spec/info" onclick="inCpAppSpec.Info('{[=v.meta.id]}')">{[=v.meta.name]}</a>
  </td>
  <td>{[=v.meta.version]}</td>
  <td>{[=v.meta.user]}</td>
  <td>{[=v.depends.length]}</td>
  <td>{[=v._ipm_num]}</td>
  <td>{[=v._executor_num]}</td>
  <td>
    <button class="pure-button button-xsmall"
      onclick="inCpAppSpec.CfgSet('{[=v.meta.id]}')">
      {[=v.configurator.fields.length]}
    </button>
  </td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    {[if (inCp.UserSession.username == "sysadmin") {]}
    <button class="pure-button button-xsmall" onclick="inCpAppSpec.Download('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-save" aria-hidden="true"></span> Download
    </button>
    {[}]}
    <button class="pure-button button-xsmall" onclick="inCpApp.InstNew('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span> Launch
    </button>
    {[if (inCp.UserSession.username == "sysadmin") {]}
    <button class="pure-button button-xsmall" onclick="inCpAppSpec.SetRaw('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting Raw
    </button>
    {[}]}
    {[if (v.meta.user == inCp.UserSession.username) {]}
    <button class="pure-button button-xsmall" onclick="inCpAppSpec.Set('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
    </button>
    {[}]}
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
     New Spec
  </a>
</li>
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpAppSpec.SetRaw()">
     New Spec by Raw
  </a>
</li>
</script>
