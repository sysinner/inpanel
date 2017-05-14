<div class="loscp-div-light">
<div id="loscp-resdomain-list-alert" class="loscp-hide"></div>
<table class="table table-hover">
  <thead>
    <tr>
      <th>Domain</th>
      <th>Description</th>
      <th>Bounds</th>
      <th>App</th>
      <th>Action</th>
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="loscp-resdomain-list"></tbody>
</table>
</div>

<script type="text/html" id="loscp-resdomain-list-tpl">
{[~it.items :v]}
<tr>
  <td class="loscp-font-fixspace">{[=v._name]}</td>
  <td>{[=v.description]}</td>
  <td>
    <button class="loscp-btn loscp-btn-xsmall" onclick="losCpResDomain.BoundList('{[=v._name]}')" style="width:40px">{[=v.bounds.length]}</button>
  </td>
  <td class="loscp-font-fixspace">{[=v.operate.app_id]}</td>
  <td>{[=v.action]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="loscp-btn loscp-btn-xsmall" onclick="losCpResDomain.Deploy('{[=v._name]}')">
      <span class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span> Deploy 
    </button>
    <button class="loscp-btn loscp-btn-xsmall" onclick="losCpResDomain.Set('{[=v._name]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setting
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="loscp-resdomain-optools">
<li class="loscp-btn loscp-btn-primary">
  <a href="#" onclick="losCpResDomain.New()">
    Add Domain
  </a>
</li>
</script>
