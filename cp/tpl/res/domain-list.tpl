<div class="incp-div-light">
  <div id="incp-resdomain-list-alert" class="incp-hide"></div>
  <div id="incp-resdomain-list-box"></div>
</div>


<script type="text/html" id="incp-resdomain-list-tpl">
<table class="table table-hover valign-middle">
  <thead>
    <tr>
      <th>Domain</th>
      {[? it._options.ops_mode || it._options.owner_column]}
      <th>Owner</th>
      {[?]}
      <th>Description</th>
      <th>Bounds</th>
      <th>App</th>
      <th>Action</th>
      <th>Updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="incp-resdomain-list">
    {[~it.items :v]}
    <tr>
      <td class="incp-font-fixspace">{[=v._name]}</td>
      {[? it._options.ops_mode || it._options.owner_column]}
      <td class="incp-ctn-hover">{[=v.meta.user]}</td>
      {[?]}
      <td>{[=v.description]}</td>
      <td>
        <button class="incp-btn incp-btn-xsmall" onclick="inCpResDomain.BoundList('{[=v._name]}')" style="width:40px">{[=v.bounds.length]}</button>
      </td>
      <td class="incp-font-fixspace">{[=v.operate.app_id]}</td>
      <td>{[=v.action]}</td>
      <td>{[=l4i.UnixMillisecondFormat(v.meta.updated, "Y-m-d")]}</td>
      <td align="right">
        <button class="btn btn-sm btn-outline-primary" onclick="inCpResDomain.Deploy('{[=v._name]}')">
          <span class="fa fa-cloud-upload-alt"></span>
          Deploy
        </button>
        <button class="btn btn-sm btn-outline-primary" onclick="inCpResDomain.Set('{[=v._name]}')">
          <span class="fa fa-cog"></span>
          Setting
        </button>
      </td>
    </tr>
    {[~]}
  </tbody>
</table>
</script>

<script type="text/html" id="incp-resdomain-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpResDomain.New()">
    Add Domain
  </a>
</li>
</script>


<script type="text/html" id="incp-mod-domain-new-tpl">

<div id="incp-mod-domain-new-alert"></div>

<table class="incp-formtable" id="incp-mod-domain-new-form">
<tbody>

<tr>
  <td width="200px">Name</td>
  <td class="">
    <input type="text" class="form-control" name="meta_name" value="">
  </td>
</tr>


{[? it._options.user_groups]}
<tr>
  <td width="260px">Owner</td>
  <td>
    <select name="incp-mod-domain-new-meta-user" id="incp-mod-domain-new-meta-user" class="form-control">
    {[~it._options.user_groups :v]}
      <option value="{[=v]}">{[=v]}</option>
    {[~]}
    </select>
  </td>
</tr>
{[?]}

</tbody>
</table>
</script>

