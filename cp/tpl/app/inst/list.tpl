<div id="incp-appls-alert" class="alert hide"></div>
<div id="incp-appls" class="incp-div-light"></div>

<script id="incp-appls-tpl" type="text/html">
<table class="table table-hover">
<thead>
  <tr>
    <th>ID</th>
    <th>Name</th>
    {[? it._options.ops_mode]}
    <th>User</th>
    {[?]}
    <th>Spec</th>
    <th>Pod</th>
    <th>Options</th>
    <th>Status</th>
    <th>Updated</th>
    <th></th>
  </tr>
</thead>
<tbody>
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">{[=v.meta.id]}</td>
  <td>{[=v.meta.name]}</td>
  {[? it._options.ops_mode]}
  <td>{[=v.meta.user]}</td>
  {[?]}
  <td class="incp-font-fixspace">
    <a href="#spec.detail" onclick="inCpAppSpec.Info('{[=v.spec.meta.id]}', null, '{[=v.spec.meta.version]}')">{[=v.spec.meta.id]}/v{[=v.spec.meta.version]}</a>
  </td>
  <td>
    <a href="#pod.detail" onclick="inCpApp.InstPodInfo('{[=v.operate.pod_id]}')" class="incp-font-fixspace">{[=v.operate.pod_id]}</a>
  </td>
  <td>
   {[if (v.operate.options.length > 0) {]}
     <button class="incp-btn incp-btn-xsmall" onclick="inCpApp.OpOptInfo('{[=v.meta.id]}')" style="width:30px">{[=v.operate.options.length]}</button>
   {[}]}
  </td>
  <td>
    <span class="badge badge-{[if (inCp.OpActionAllow(v.operate.action, inCp.OpActionStart)) {]}success{[} else {]}default{[}]}">
      {[=inCp.OpActionTitle(v.operate.action)]}
    </span>
  </td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    {[if (!inCp.OpActionAllow(v.operate.action, inCp.OpActionDestroy)) {]}
    <button class="pure-button button-xsmall" onclick="inCpApp.InstDeploy('{[=v.meta.id]}')">
      <img src="/in/cp/~/open-iconic/svg/cloud-upload.svg"> Deploy 
    </button>
    <button class="pure-button button-xsmall" onclick="inCpApp.InstSet('{[=v.meta.id]}', '{[=v.spec.meta.id]}')">
      <img src="/in/cp/~/open-iconic/svg/cog.svg"> Setup
    </button>
    {[}]}
  </td>
</tr>
{[~]}
</tbody>
</table>
</script>

<script type="text/javascript">

$("#incp-appls-qry").submit(function(event) {
    event.preventDefault();
    inCpApp.InstListRefresh();
});

</script>

<script type="text/html" id="incp-appls-optools">
<!--<li>
  <form action="#" class="form-inlines">
    <input id="query_text" type="text"
      class="form-control incp-query-input" 
      placeholder="Press Enter to Search" 
      value="">
  </form>
</li>-->
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpApp.InstLaunchNew()">
     Launch new Instance
  </a>
</li>
</script>
