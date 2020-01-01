<div id="inops-podspec-imagels-alert"></div>

<div class="incp-div-light">
<table class="table table-hover valign-middle">
  <thead><tr>
    <th>Name:Tag</th>
    <th>Display Name</th>
    <th>Driver</th>
    <th>Action</th>
    <th>Updated</th>
    <th></th>
  </tr></thead>
  <tbody id="inops-podspec-imagels"></tbody>
</table>
</div>

<script id="inops-podspec-imagels-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">{[=v.name]}:{[=v.tag]}</td>
  <td>{[=v.meta.name]}</td>
  <td>{[=v.driver]}</td>
  <td>
  {[~it.actions :av]}
    {[? av.action == v.action]}{[=av.title]}{[?]}
  {[~]}
  </td>
  <td>{[=l4i.UnixMillisecondFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsPod.SpecPlanImageSet('{[=v.meta.id]}')">
      <span class="fa fa-cog"></span>
      Settings
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="inops-podspec-imagels-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsPod.SpecPlanImageSet()">
    New Image
  </a>
</li>
</script>
