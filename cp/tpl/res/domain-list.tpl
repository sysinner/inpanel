<div class="incp-div-light">
<div id="incp-resdomain-list-alert" class="incp-hide"></div>
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
  <tbody id="incp-resdomain-list"></tbody>
</table>
</div>

<script type="text/html" id="incp-resdomain-list-tpl">
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">{[=v._name]}</td>
  <td>{[=v.description]}</td>
  <td>
    <button class="incp-btn incp-btn-xsmall" onclick="inCpResDomain.BoundList('{[=v._name]}')" style="width:40px">{[=v.bounds.length]}</button>
  </td>
  <td class="incp-font-fixspace">{[=v.operate.app_id]}</td>
  <td>{[=v.action]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="incp-btn incp-btn-xsmall" onclick="inCpResDomain.Deploy('{[=v._name]}')">
      <img src="/in/cp/~/open-iconic/svg/cloud-upload.svg"> Deploy 
    </button>
    <button class="incp-btn incp-btn-xsmall" onclick="inCpResDomain.Set('{[=v._name]}')">
      <img src="/in/cp/~/open-iconic/svg/cog.svg"> Setting
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="incp-resdomain-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpResDomain.New()">
    Add Domain
  </a>
</li>
</script>
