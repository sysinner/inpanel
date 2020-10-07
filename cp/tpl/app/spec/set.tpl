<div id="incp-app-specset-alert" class="alert alert-danger hide"></div>

<div id="incp-app-specset" class="incp-div-light" style="box-sizing: border-box;">loading</div>
<style>
#incp-app-specset .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 120%;
}
#incp-app-specset button.icon-x20 {
  padding: 0px;
  width: 22px;
  height: 22px;
  font-size: 11px;
  text-align: center;
}
#incp-app-specset th {
  font-weight: normal;
}
#incp-app-specset .card-body {
  padding: 0 10px;
}
</style>
<script id="incp-app-specset-raw-tpl" type="text/html">
<div class="card">

<div class="card-header">
  <div class="row">
    <div class="col-md-8">
      {[=it.actionTitle]}
    </div>
    <div class="col-md-4 text-right">
      <button class="btn btn-sm btn-primary" onclick="inCpAppSpec.Set('{[=it.meta_id]}')">
        <span class="fa fa-edit"></span> Visual editing mode
      </button>
      <button class="btn btn-sm btn-outline-danger" onclick="inCpAppSpec.ItemDel('{[=it.meta_id]}')">
        <span class="fa fa-times-circle"></span> Delete
      </button>
    </div>
  </div>
</div>

<div class="card-body">

  <input type="hidden" name="meta_id" value="{[=it.meta_id]}">

  <div style="padding:10px 0">
    <textarea id="incp-app-specset-spectext" name="spec_text" class="form-control" rows="20">{[=it.spec_text]}</textarea>
  </div>

  <div style="padding:10px 0">
    <button class="btn btn-primary" onclick="inCpAppSpec.SetRawCommit()">
      Save
    </button>
    <button class="btn btn-default" onclick="inCpAppSpec.ListRefresh()" style="margin-left:10px">
      Cancel
    </button>
  </div>
</div>

</div>
</script>

<script id="incp-app-specset-tpl" type="text/html">
<div class="card">

<div class="card-header">
  <div class="row">
    <div class="col-md-8">
      {[=it.actionTitle]}
    </div>
    <div class="col-md-4 text-right">
      {[? it.spec.meta.user == inCp.UserSession.username || inCp.UserSession.username == "sysadmin"]}
      <button class="btn btn-sm btn-primary" onclick="inCpAppSpec.SetRaw('{[=it.spec.meta.id]}')">
        <span class="fa fa-edit"></span> Advanced editing mode
      </button>
      <button class="btn btn-sm btn-outline-danger" onclick="inCpAppSpec.ItemDel('{[=it.spec.meta.id]}')">
        <span class="fa fa-times-circle"></span> Delete
      </button>
      {[?]}
    </div>
  </div>
</div>

<div class="card-body">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="260px">ID <span style="color:red">*</span></td>
  <td width="30px"></td>
  <td>
    <input name="meta_id" class="form-control form-control-sm" 
      value="{[=it.spec.meta.id]}" {[? it.spec.meta.id && it.spec.meta.id.length > 0]}readonly{[?]}>
    {[? !it.spec.meta.id || it.spec.meta.id.length < 1]}
    <small>Example: company-product, or company-product-alias</small>
    {[?]}
  </td>
</div>

<tr>
  <td>Title <span style="color:red">*</span></td>
  <td></td>
  <td>
    <input name="meta_name" class="form-control form-control-sm" value="{[=it.spec.meta.name]}">
	<small>A human readable title, between 1 and 30 characters in length.<small>
  </td>
</tr>

<tr>
  <td>Subtitle</td>
  <td></td>
  <td>
    <input name="meta_subtitle" class="form-control form-control-sm" value="{[=it.spec.meta.subtitle]}">
	<small>An optional and human readable subtitle, between 0 and 100 characters in length.<small>
  </td>
</tr>

<tr>
  <td>Description</td>
  <td></td>
  <td>
    <textarea name="description" class="form-control" rows="4">{[=it.spec.description]}</textarea>
    <small>An optional and human readable description of this application, allow format in TEXT or Markdown and between 0 and 2000 characters in length.</small>
  </td>
</div>

<!-- <tr>
  <td>Bound Spec Plans (draft)</td>
  <td><input name="draft_bound_plans" class="form-control form-control-sm" value="{[=it.spec.draft_bound_plans]}"></td>
</div> -->


<tr>
  <td>
    Import Package
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetPackSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-ipmls-msg" class="badge badge-secondary">no package yet ...</div>
    <div id="incp-app-specset-ipmls"></div>
  </td>
</tr>


<tr>
  <td>
    Import Git Repo
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetVcsSet()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-vcsls-msg" class="badge badge-secondary">no repo yet ...</div>
    <div id="incp-app-specset-vcsls"></div>
  </td>
</tr>

<tr>
  <td>
    Import AppSpec
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDependSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-depls-msg" class="badge badge-secondary">no AppSpec yet ...</div>
    <div id="incp-app-specset-depls"></div>
  </td>
</tr>

<tr>
  <td>
    Remotely dependent AppSpec
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDepRemoteSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-depremotes-msg" class="badge badge-secondary">no AppSpec yet ...</div>
    <div id="incp-app-specset-depremotes"></div>
  </td>
</tr>

<tr>
  <td>
    Script Executors
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorSet()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-executorls-msg" class="badge badge-secondary">no executor yet ...</div>
    <div id="incp-app-specset-executorls"></div>
  </td>
</tr>

<tr>
  <td>
    Service Ports
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table>
      <thead>
        <tr>
          <th width="33%">Port (1025 ~ 65535)</th>
          <th width="33%">Name (tcp,http, ...)</th>
          {[? it.spec._host_port_enable]}
          <th>Host Port (1 ~ 9999)</th>
          {[??]}
          <th></th>
          {[?]}
          <th width="30px"></th>
        <tr>
      </thead>
      <tbody id="incp-app-specset-serviceports">
        {[~it.spec.service_ports :vp]}
        <tr class="incp-app-specset-serviceport-item">
          <td>
            <input name="sp_box_port" type="text" value="{[=vp.box_port]}" class="form-control form-control-sm">
          </td>
          <td>
            <input name="sp_name" type="text" value="{[=vp.name]}" class="form-control form-control-sm">
          </td>
          {[? it.spec._host_port_enable]}
          <td>
            <input name="sp_host_port" type="text" value="{[=vp.host_port]}" class="form-control form-control-sm">
          </td>
          {[??]}
          <td></td>
          {[?]}
          <td align="right">
            <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>


<tr>
  <td>Minimum Requirements <span style="color:red">*</span></td>
  <td></td>
  <td>
    <table>
    <tr>
      <td width="33%">
        <label>CPU cores (0.1 ~ 16)</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_cpu_min" value="{[=it.spec.exp_res._cpu_min]}">
          <div class="input-group-append"><div class="input-group-text">Cores</div></div>
        </div>
      </td>
      <td width="33%">
        <label>Memory Size</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_mem_min" value="{[=it.spec.exp_res.mem_min]}">
          <div class="input-group-append"><div class="input-group-text">MB</div></div>
        </div>
      </td>
      <td>
        <label>System Volume Size</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_vol_min" value="{[=it.spec.exp_res.vol_min]}">
          <div class="input-group-append"><div class="input-group-text">GB</div></div>
        </div>
      </td>
    </tr>
    </table>
  </td>
</tr>


<tr>
  <td>Deployment Requirements <span style="color:red">*</span></td>
  <td></td>
  <td>
    <table>
    <tbody>
    <tr>
      <td width="33%">Number of Replicas (1 ~ 256)</td>
      <td width="33%">System State</td>
      <td>Network Mode</td>
    </tr>
    <tr>
      <td>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <div class="input-group-text">Min</div>
          </div>
          <input type="text" class="form-control" name="exp_deploy_rep_min" value="{[=it.spec.exp_deploy.rep_min]}">
          <div class="input-group-prepend">
            <div class="input-group-text">Max</div>
          </div>
          <input type="text" class="form-control" name="exp_deploy_rep_max" value="{[=it.spec.exp_deploy.rep_max]}">
        </div>
      </td>
      <td>
        <select name="exp_deploy_sys_state" class="form-control form-control-sm">
        {[~it._deploy_sys_states :v]}
        <option value="{[=v.value]}" {[if (it.spec.exp_deploy.sys_state == v.value) {]} selected{[}]}>{[=v.title]}</option>
        {[~]}
        </select>
      </td>
      <td>
        <select name="exp_deploy_network_mode" class="form-control form-control-sm">
        {[~it._deploy_network_modes :v]}
        <option value="{[=v.value]}" {[if (it.spec.exp_deploy.network_mode == v.value) {]} selected{[}]}>{[=v.title]}</option>
        {[~]}
        </select>
      </td>
    </tr>
    </tbody>
    </table>
  </td>
</tr>

<tr>
  <td>High Availability</td>
  <td>
    <div class="form-check">
      <input id="exp_deploy_failover_checkbox" class="form-check-input" type="checkbox" value="1" {[? it.spec.exp_deploy._failover_enable]}checked="checked"{[?]} onclick="inCpAppSpec.SetDeployFailoverRefresh()">
    </div>
  </td>
  <td>
    <table id="exp_deploy_failover_box" width="100%" style="{[? it.spec.exp_deploy._failover_enable]}{[??]}display:none{[?]}">
    <tbody>
    <tr>
      <td width="33%" valign="top">
        <label>Delay time before failover</label>
      </td>
      <!-- <td width="33%" valign="top">
        <label>Max number of fails in recovering</label>
      </td> -->
      <td width="33%" valign="top">
        <label>Max percentage of fails and replicas in recovering</label>
      </td>
      <td></td>
    </tr>
    <tr>
      <td valign="top">
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_deploy_failover_time" value="{[=it.spec.exp_deploy.failover_time]}">
          <div class="input-group-append"><div class="input-group-text">seconds</div></div>
        </div>
        <small>when fail occurs, the scheduler will delay a fixed time before performing a failover task</small>
      </td>
      <!-- <td valign="top">
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_deploy_failover_num_max" value="{[=it.spec.exp_deploy.failover_num_max]}">
        </div>
        <small>when the number of fails is greater than this, the scheduler will stop create failover task</small>
      </td> -->
      <td valign="top">
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_deploy_failover_rate_max" value="{[=it.spec.exp_deploy.failover_rate_max]}">
          <div class="input-group-append"><div class="input-group-text">1 ~ 50</div></div>
        </div>
        <small>when the percentage of fails and replicas is greater than this, the scheduler will stop create failover task</small>
      </td>
      <td></td>
    </tr>
    </tbody>
    </table>
  </td>
</tr>


<tr>
  <td>Allowed Roles</td>
  <td></td>
  <td>
    <span style="margin-right:10px">
      <input type="checkbox" name="" value="0" checked="checked" disabled> Owner
    </span>
    {[~it.spec._roles.items :v]}
    <span style="margin-right:10px">
      {[if (v._checked) {]}
      <input type="checkbox" name="roles" value="{[=v.id]}" checked="checked"> {[=v.name]}
      {[} else {]}
      <input type="checkbox" name="roles" value="{[=v.id]}"> {[=v.name]}
      {[}]}
    </span>
    {[~]}
  </td>
</tr>


<tr>
  <td>Type Tags</td>
  <td></td>
  <td>
    {[~it.spec._type_tags.items :v]}
    <span style="margin-right:10px">
      <input type="checkbox" name="type_tags" value="{[=v.name]}" {[? v._checked]}checked="checked"{[?]}> {[=v.value]}
    </span>
    {[~]}
  </td>
</tr>

<tr>
  <td>Version Comment</td>
  <td></td>
  <td>
    <input type="text" name="comment" class="form-control form-control-sm" value="">
  </td>
</tr>


<tr>
  <td></td>
  <td></td>
  <td>
    <div id="incp-appspec-set-footer">
      <button class="btn btn-primary" onclick="inCpAppSpec.SetCommit()">
        Save
      </button>
      <button class="btn btn-default" onclick="inCpAppSpec.ListRefresh()" style="margin-left:10px">
        Cancel
     </button>
	</div>
    <div id="incp-appspec-set-footer-alert" class="alert hide"></div>
  </td>
</tr>

</tbody>
</table>

</div>
</div>
</script>


<script id="incp-app-specset-depls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>ID</th>
    <th>Name</th>
    <th>Version</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-depls-id{[=v.id]}">
    <td>{[=v.id]}</td>
    <td>{[=v.name]}</td>
    <td><input id="app_specset_depend_version_{[=v.id]}" class="form-control form-control-sm" value="{[=v.version]}" style="max-width:120px"/></td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDependRemove('{[=v.id]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>


<script id="incp-app-specset-depremotes-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>ID</th>
    <th>Name</th>
    <th>Version</th>
    <th>Configs</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-depremote-id{[=v.id]}">
    <td>{[=v.id]}</td>
    <td>{[=v.name]}</td>
    <td><input id="app_specset_dep_remote_version_{[=v.id]}" class="form-control form-control-sm" value="{[=v.version]}" style="max-width:120px"/></td>
    <td>{[=v.configs.join(", ")]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDepRemoteRemove('{[=v.id]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>

<script id="incp-app-specset-ipmls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>Name</th>
    <th>Version</th>
    <th>Volume</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-ipmls-name{[=v.name]}">
    <td>{[=v.name]}</td>
    <td><input id="app_spec_setform_pkg_{[=v.name]}" class="form-control form-control-sm" value="{[=v.version]}" style="max-width:160px" onchange="inCpAppSpec.SetPackVersionRefresh('{[=v.name]}')"/></td>
    <td id="app_spec_setform_pkg_vol_{[=v.name]}">/usr/sysinner/{[=v.name]}/{[=v.version]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetPackRemove('{[=v.name]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>


<script id="incp-app-specset-vcsls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>Repo URL</th>
    <th>Branch</th>
    <th>Clone Directory</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr>
    <td>{[=v.url]}</td>
    <td>{[=v.branch]}</td>
    <td>/home/action/{[=v.dir]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" " onclick="inCpAppSpec.SetVcsSet('{[=v.dir]}')">
        <i class="fa fa-edit"></i>
      </button>
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetVcsRemove('{[=v.dir]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>

<script id="incp-app-specset-executorls-tpl" type="text/html">
{[~it :v]}
<div class="incp-app-specset-gn-box">
  <div class="head">
    <span class="title">{[=v.name]}</span>
    <span class="options">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorSet('{[=v.name]}')">
        <i class="fa fa-edit"></i>
      </button>
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorRemove('{[=v.name]}')">
        <i class="fa fa-times"></i>
      </button>
    </span>
  </div>
  <div class="body">
    <table width="100%">
      <tr>
        <td width="120">ExecStart</td>
        <td><pre><code class="bash">{[=v.exec_start.trim()]}</code></pre></td>
      </tr>
      {[? v.exec_stop && v.exec_stop.trim().length > 0]}
      <tr>
        <td>ExecStop</td>
        <td><pre><code class="bash">{[=v.exec_stop.trim()]}</code></pre></td>
      </tr>
      {[?]}
      <tr>
        <td>Priority</td>
        <td>{[=v.priority]}</td>
      </tr>
      <tr>
        <td>Plan</td>
        <td>
          {[if (v.plan.on_boot) {]}
            On Boot
          {[}]}
          {[if (v.plan.on_tick > 0) {]}
            On Tick {[=v.plan.on_tick]}
          {[}]}
        </tr>
    </table>
  </div>
</div>
{[~]}
</script>

<script id="incp-app-specset-serviceport-tpl" type="text/html">
<tr class="incp-app-specset-serviceport-item">
  <td>
    <input name="sp_box_port" type="text" value="" class="form-control form-control-sm">
  </td>
  <td>
    <input name="sp_name" type="text" value="" class="form-control form-control-sm">
  </td>
  {[? it._host_port_enable]}
  <td>
    <input name="sp_host_port" type="text" value="" class="form-control form-control-sm">
  </td>
  {[??]}
  <td></td>
  {[?]}
  <td align="right">
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortDel(this)">
      <i class="fa fa-times"></i>
    </button>
  </td>
</tr>
</script>
