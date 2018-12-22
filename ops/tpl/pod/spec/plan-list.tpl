<div id="inops-podspec-planls-alert"></div>

<div class="incp-div-light">
<table class="table table-hover valign-middle">
  <thead><tr>
    <th>ID</th>
    <th>Plan</th>
    <th>Zones</th>
    <th>Status</th>
    <th>Updated</th>
    <th></th>
  </tr></thead>
  <tbody id="inops-podspec-planls"></tbody>
</table>
</div>

<script id="inops-podspec-planls-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">{[=v.meta.id]}</td>
  <td>{[=v.meta.name]}</td>
  <td>{[=v._zones.join(", ")]}</td>
  <td>{[=v.status]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsPod.SpecPlanSet('{[=v.meta.id]}')">
      <span class="fa fa-cog"></span>
      Settings
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="inops-podspec-planls-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsPod.SpecPlanSet()">
    New Spec Plan
  </a>
</li>
</script>
