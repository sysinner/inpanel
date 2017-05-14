<div id="loscp-module-navbar">
  <ul id="loscp-module-navbar-menus" class="loscp-module-nav">
    <li>
	  Pod Instances
    </li>
    <!--<li>
      <form id="z28k7l" action="#" class="form-inlines">
        <input id="query_text" type="text"
          class="form-control loscp-query-input" 
          placeholder="Press Enter to Search" 
          value="">
      </form>
    </li>-->
  </ul>
  <ul id="loscp-module-navbar-optools" class="loscp-module-nav loscp-nav-right"></ul>
</div>

<div id="loscp-podls-alert"></div>

<div id="loscp-podls" class="loscp-div-light"></div>

<script type="text/html" id="loscp-podls-tpl">
<table class="table table-hover">
  <thead>
    <tr>
      <th>Instance ID</th>
      <th>Name</th>
      <th>Spec</th>
      <th>Apps</th>
      {[if (!it._zone_active) {]}
      <th>Cluster</th>
      {[}]}
      {[if (it._zone_active) {]}
      <th>Ports</th>   
      {[}]}
      <th>Action</th>   
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
{[~it.items :v]}
  <tr>
    <td class="loscp-font-fixspace">
      <a class="" href="#info/{[=v.meta.id]}" onclick="losCpPod.Info('{[=v.meta.id]}')">{[=v.meta.id]}</a>
    </td>
    <td>{[=v.meta.name]}</td>
    <td>{[=v.spec.ref.name.substr("pod/spec/plan/".length)]}</td>
    <td>{[=v.apps.length]}</td>
    {[if (!it._zone_active) {]}
    <td>{[=v.spec.zone]} / {[=v.spec.cell]}</td>
    {[}]}
    {[if (it._zone_active) {]}
    <td class="loscp-font-fixspace" style="font-size:80%">
    {[if (v.operate.ports && v.operate.ports.length > 0) {]}
    {[~v.operate.ports :opv]}
      <div>{[=opv.host_port]} &gt {[=opv.box_port]}/tcp</div>
    {[~]}
    {[}]}
    </td>
    {[}]}
    <td>
     <span class="label {[if (v.operate.action == "start") {]}label-success{[} else {]}label-default{[}]}">{[=v.operate.action]}</span>
    </td>
    <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
    <td align="right">
      <button class="pure-button button-xsmall" onclick="losCpPod.SetInfo('{[=v.meta.id]}')">
        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
	  </button>
    </td>
  </tr>
{[~]}
</tbody>
</table>
</script>

<script type="text/javascript">
$("#loscp-podls").on("click", ".loscp-pod-item", function() {
    var id = $(this).attr("href").substr(1);
    losCpPod.Set(id);
});
</script>


<script type="text/html" id="loscp-podls-optools">
<li class="loscp-btn loscp-btn-primary">
  <a href="#" onclick="losCpPod.New()">
    New Pod Instance
  </a>
</li>
</script>
