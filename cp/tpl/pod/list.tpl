<div id="incp-module-navbar">
  <ul id="incp-module-navbar-menus" class="incp-module-nav">
    <li><a class='l4i-nav-item active' href='#pod/instance'>Pod Instance</a></li>
    <!--<li>
      <form id="z28k7l" action="#" class="form-inlines">
        <input id="query_text" type="text"
          class="form-control incp-query-input" 
          placeholder="Press Enter to Search" 
          value="">
      </form>
    </li>-->
  </ul>
  <ul id="incp-module-navbar-optools" class="incp-module-nav incp-nav-right"></ul>
</div>

<div id="incp-podls-alert"></div>

<div id="incp-podls" class="incp-div-light"></div>

<script type="text/html" id="incp-podls-tpl">
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
      <th>Replicas</th>   
      <th>Updated</th>
      <th>Status</th>
      <th>Action</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
{[~it.items :v]}
  <tr>
    <td class="incp-font-fixspace">
      <a class="" href="#info/{[=v.meta.id]}" onclick="inCpPod.Info('{[=v.meta.id]}')">{[=v.meta.id]}</a>
    </td>
    <td>{[=v.meta.name]}</td>
    <td>{[=v.spec.ref.name.substr("pod/spec/plan/".length)]}</td>
    <td>{[=v.apps.length]}</td>
    {[if (!it._zone_active) {]}
    <td>{[=v.spec.zone]} / {[=v.spec.cell]}</td>
    {[}]}
    <td>{[=v.operate.replicas.length]}</td>
    <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
    <td>
      <button class="pure-button button-xsmall" onclick="inCpPod.Entry('{[=v.meta.id]}')">
        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Detail
	  </button>
    </td>
    <td>
      <select class="pure-button button-xsmall {[if (v.operate.action == 2) {]} button-success{[}]}" 
        onchange="inCpPod.ListOpActionChange('{[=v.meta.id]}', this)">
        {[~it._actions :av]}
          <option value="{[=av.action]}" {[if (av.action == v.operate.action) {]}selected{[}]}>{[=av.title]}</div>
        {[~]}
      </select>
    </td>
    <td align="right">
      <button class="pure-button button-xsmall" onclick="inCpPod.SetInfo('{[=v.meta.id]}')">
        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
	  </button>
    </td>
  </tr>
{[~]}
</tbody>
</table>
</script>

<script type="text/javascript">
$("#incp-podls").on("click", ".incp-pod-item", function() {
    var id = $(this).attr("href").substr(1);
    inCpPod.Set(id);
});
</script>


<script type="text/html" id="incp-podls-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpPod.New()">
    New Pod Instance
  </a>
</li>
</script>
