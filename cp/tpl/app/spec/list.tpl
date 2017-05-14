<div id="loscp-app-specls-alert" class="alert"></div>

<div class="loscp-div-light">
<table class="table table-hover">
  <thead>
    <tr>
      <th>Name</th>
      <th>Version</th>
      <th>Owner</th>
      <th>Packages</th>
      <th>Executors</th>
      <th>Configurator</th>
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="loscp-app-specls"></tbody>
</table>
</div>

<script id="loscp-app-specls-tpl" type="text/html">  
{[~it.items :v]}
<tr>
  <td>
    <a href="#app/spec/info" onclick="losCpAppSpec.Info('{[=v.meta.id]}')">{[=v.meta.name]}</a>
  </td>
  <td>{[=v.meta.version]}</td>
  <td>{[=v.meta.user]}</td>
  <td>{[=v._lpm_num]}</td>
  <td>{[=v._executor_num]}</td>
  <td>
    <button class="pure-button button-xsmall"
      onclick="losCpAppSpec.CfgSet('{[=v.meta.id]}')">
      {[=v.configurator.fields.length]}
    </button>
  </td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="pure-button button-xsmall" onclick="losCpAppSpec.Download('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-save" aria-hidden="true"></span> Download
    </button>
    <button class="pure-button button-xsmall" onclick="losCpApp.InstNew('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span> Launch
    </button>
    {[if (v.meta.user == losCp.UserSession.username) {]}
    <button class="pure-button button-xsmall" onclick="losCpAppSpec.SetRaw('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting Raw
    </button>
    <button class="pure-button button-xsmall" onclick="losCpAppSpec.Set('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
    </button>
    {[}]}
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">
$("#loscp-app-specls-qry").submit(function(event) {
    event.preventDefault();
    losCpAppSpec.ListRefresh("loscp-app-specls");
});
</script>


<script type="text/html" id="loscp-app-specls-optools">
<!--<li>
  <form action="#" class="form-inlines">
    <input id="query_text" type="text"
      class="form-control loscp-query-input" 
      placeholder="Press Enter to Search" 
      value="">
  </form>
</li>-->
<li class="loscp-btn loscp-btn-primary">
  <a href="#" onclick="losCpAppSpec.Set()">
     New Spec
  </a>
</li>
<li class="loscp-btn loscp-btn-primary">
  <a href="#" onclick="losCpAppSpec.SetRaw()">
     New Spec by Raw
  </a>
</li>
</script>
