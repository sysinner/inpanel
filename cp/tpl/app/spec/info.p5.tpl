<div class="l4i-form-group">
  <label>ID / Owner</label>
  <p>{[=it.meta.id]} / {[=it.meta.user]}</p>
</div>

{[? it.description]}
<div class="l4i-form-group">
  <label>Description</label>
  <p>{[=it.description]}</p>
</div>
{[?]}

{[if (it.depends.length > 0) {]}
<div class="l4i-form-group">
  <label>Depends</label>

  <div id="incp-app-specset-depls">
    <table class="table table-hover">
      <thead><tr>
        <th>ID</th>
        <th>Name</th>
        <th>Version</th>
      </tr></thead>
      <tbody>
      {[~it.depends :v]}
      <tr id="incp-app-specset-depls-id{[=v.id]}">
        <td>{[=v.id]}</td>
        <td>{[=v.name]}</td>
        <td>{[=v.version]}</td>
      </tr>
      {[~]}
      </tbody>
    </table>
  </div>
</div>
{[}]}

{[if (it.packages.length > 0) {]}
<div class="l4i-form-group">
  <label>Packages</label>

  <div id="incp-app-specset-ipmls">
    <table class="table table-hover">
      <thead><tr>
        <th>Name</th>
        <th>Version</th>
        <th>Release</th>
        <th>Dist / Arch</th>
        <th>Volume</th>
      </tr></thead>
      <tbody>
      {[~it.packages :v]}
      <tr id="incp-app-specset-ipmls-name{[=v.name]}">
        <td>{[=v.name]}</td>
        <td>{[=v.version]}</td>
        <td>{[=v.release]}</td>
        <td>{[=v.dist]} / {[=v.arch]}</td>
        <td>/usr/sysinner/{[=v.name]}/{[=v.version]}</td>
      </tr>
      {[~]}
      </tbody>
    </table>
  </div>
</div>
{[}]}

{[if (it.executors.length > 0) {]}
<div class="l4i-form-group">
  <label>Executors</label>

  <div id="incp-app-specset-executorls">
    {[~it.executors :v]}
    <div class="incp-app-specset-gn-box">
      <div class="head">
        <span class="title">{[=v.name]}</span>
      </div>
      <div class="body">
        <table width="100%">
          <tr>
            <td width="120">ExecStart</td>
            <td><pre><code class="bash">{[=v.exec_start.trim()]}</code></pre></td>
          </tr>
          {[if (v.exec_stop.trim().length > 0) {]}
          <tr>
            <td>ExecStop</td>
            <td><pre><code class="bash">{[=v.exec_stop.trim()]}</code></pre></td>
          </tr>
          {[}]}
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
  </div>
</div>
{[}]}

{[if (it.service_ports.length > 0) {]}
<div class="l4i-form-group">
  <label>Service Ports</label>

  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name (http,https, ...)</th>
          <th>Box Port</th>
        <tr>
      </thead>
      <tbody>
        {[~it.service_ports :vp]}
        <tr>
          <td>{[=vp.name]}</td>
          <td>{[=vp.box_port]}</td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </div>
</div>
{[}]}

{[if (it._roles.length > 0) {]}
<div class="l4i-form-group">
  <label>Allowed Roles</label>
  <div>
    <span class="label label-default">{[=it._roles.join("</span>&nbsp;<span class='label label-default'>")]}</span>
  </div>
</div>
{[}]}

<div class="l4i-form-group">
  <label>Resource Requirements</label>

  <div>
    <table width="100%" class="_table_right_space">
    <tr>
      <td>
        <div>CPU units (minimum)</div>
        <div class="input-group">
          {[=it.exp_res.cpu_min]} m
        </div>
      </td>
      <td>
        <div>Memory Size (minimum)</div>
        <div class="input-group">
          {[=inCp.UtilResSizeFormat(it.exp_res.mem_min)]}
        </div>
      </td>
      <td>
        <div>System Volume Size (minimum)</div>
        <div class="input-group">
          {[=inCp.UtilResSizeFormat(it.exp_res.vol_min, 1)]}
        </div>
      </td>
    </tr>
    </table>
  </div>
</div>
