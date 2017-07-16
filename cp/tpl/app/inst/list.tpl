<div id="loscp-appls-alert" class="alert hide"></div>

<div class="loscp-div-light">
<table class="table table-hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Spec</th>
      <th>Pod</th>
      <th>Options</th>
      <th>Updated</th>
      <th>Action</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="loscp-appls"></tbody>
</table>
</div>

<script id="loscp-appls-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="loscp-font-fixspace">{[=v.meta.id]}</td>
  <td>{[=v.meta.name]}</td>
  <td class="loscp-font-fixspace">
    <a href="#spec.detail" onclick="losCpAppSpec.Info('{[=v.spec.meta.id]}')">{[=v.spec.meta.name]}/v{[=v.spec.meta.version]}</a>
  </td>
  <td>
    <a href="#pod.detail" onclick="losCpPod.Info('{[=v.operate.pod_id]}')" class="loscp-font-fixspace">{[=v.operate.pod_id]}</a>
  </td>
  <td>
   {[if (v.operate.options.length > 0) {]}
     <button class="loscp-btn loscp-btn-xsmall" onclick="losCpApp.OpOptInfo('{[=v.meta.id]}')" style="width:30px">{[=v.operate.options.length]}</button>
   {[}]}
  </td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td>
    <select class="pure-button button-xsmall {[if (v.operate.action == 2) {]} button-success{[}]}" 
      onchange="losCpApp.InstListOpActionChange('{[=v.meta.id]}', this)">
    {[~it._actions :av]}
      <option value="{[=av.action]}" {[if (av.action == v.operate.action) {]}selected{[}]}>{[=av.title]}</div>
    {[~]}
    </select>
  </td>
  <td align="right">
    <button class="pure-button button-xsmall pure-button-primary" onclick="losCpApp.InstDeploy('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span> Deploy 
    </button>
    <button class="pure-button button-xsmall" onclick="losCpApp.InstSet('{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/javascript">

$("#loscp-appls-qry").submit(function(event) {
    event.preventDefault();
    losCpApp.InstListRefresh();
});

</script>

<script type="text/html" id="loscp-appls-optools">
<!--<li>
  <form action="#" class="form-inlines">
    <input id="query_text" type="text"
      class="form-control loscp-query-input" 
      placeholder="Press Enter to Search" 
      value="">
  </form>
</li>-->
<li class="loscp-btn loscp-btn-primary">
  <a href="#" onclick="losCpApp.InstLaunchNew()">
     Launch new Instance
  </a>
</li>
</script>
