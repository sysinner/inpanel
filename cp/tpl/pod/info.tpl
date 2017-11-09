<div class="panel panel-default">
  <div class="panel-heading">Info</div>
  <div class="panel-body">
    <table width="100%" class="incp-panel-table">
      <tr>
        <td width="220" class="lpt-title">ID</td>
        <td>{[=it.meta.id]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Name</td>
        <td>{[=it.meta.name]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Created</td>
        <td>{[=l4i.MetaTimeParseFormat(it.meta.created, "Y-m-d")]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Updated</td>
        <td>{[=l4i.MetaTimeParseFormat(it.meta.updated, "Y-m-d H:i:s")]}</td>
      </tr>
    </table>
  </div>
</div>


<div class="panel panel-default">
  <div class="panel-heading">Spec</div>
  <div class="panel-body">
    <table width="100%" class="incp-panel-table">
      <tr>
        <td width="220" class="lpt-title">ID</td>
        <td>{[=it.spec.ref.id]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Name</td>
        <td>{[=it.spec.ref.name]}</td>
      </tr>

      {[ if (it.spec.volumes && it.spec.volumes.length > 0) { ]}
      <tr>
        <td class="lpt-title">Volumes (Name / Size)</td>
        <td>
          <table width="100%"><tbody>
            {[~it.spec.volumes :v]}
            <tr>
              <td width="40%">{[=v.name]}</td>
              <td>{[=inCp.UtilResSizeFormat(v.size_limit)]}</td>
            </tr>
            {[~]}
          </tbody></table>
        </td>
      </tr>
      {[ } ]}

      {[ if (it.spec.boxes && it.spec.boxes.length > 0) { ]}
      {[~it.spec.boxes :box]}
      <tr>
        <td class="lpt-title">Box ({[=box.name]})</td>
        <td>
          <table width="100%"><tbody>
            <tr>
              <td width="40%">Image</td>
              <td>{[=box.image.driver]} / {[=box.image.ref.name]}</td>
            </tr>
            <tr>
              <td>OS / Arch</td>
              <td>{[=box.image.os_dist]} / {[=box.image.arch]}</td>
            </tr>
            <tr>
              <td>CPU</td>
              <td>{[=box.resources.cpu_limit]} m</td>
            </tr>
            <tr>
              <td>Memory</td>
              <td>{[=inCp.UtilResSizeFormat(box.resources.mem_limit)]}</td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      {[~]}
      {[ } ]}
    </table>
  </div>
</div>


<div class="panel panel-default">
  <div class="panel-heading">Operating</div>
  <div class="panel-body">
    <table width="100%" class="incp-panel-table">
      <tr>
        <td width="220" class="lpt-title">Action</td>
        <td>{[=inCp.OpActionTitle(it.operate.action)]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Cluster (Zone / Cell)</td>
        <td>{[=it.spec.zone]} / {[=it.spec.cell]}</td>
      </tr>

      {[if (it.operate.replicas && it.operate.replicas.length > 0) {]}
      {[~it.operate.replicas :rep]}
      <tr>
        <td class="lpt-title">Replicas #{[=rep.id]}</td>
        <td>
          <table class="table table-condensed">
            <tr>
              <td>Host</td>
              <td>{[?rep.node]}{[=rep.node]}{[??]}Scheduling{[?]}</td>
            </tr>
            {[if (rep.ports && rep.ports.length > 0) {]}
            <tr>
              <td class="">Service Ports</td>
              <td>
                <table style="width:100%" class="incp-font-fixspace">
                {[~rep.ports :opv]}
                <tr>
                  <td>{[=opv.name]}://{[=opv.wan_addr]}:{[=opv.host_port]}</td>
                  <td>&nbsp;&raquo;&nbsp; pod:{[=opv.box_port]}</td>
                </tr>
                {[~]}
                </table>
              </td>
            </tr>
            {[}]}
          </table>
        </td>
      </tr>
      {[~]}
      {[}]}
    </table>
  </div>
</div>


{[?it.apps]}
<div class="panel panel-default">
  <div class="panel-heading">Applications</div>
  <div class="panel-body">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Spec</th>
          <th>Packages</th>
          <th>Executors</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {[~it.apps :v]}
        <tr>
          <td>{[=v.meta.name]}</td>
          <td>{[=v.spec.meta.name]}</td>
          <td>{[if (v.spec.packages) { ]}{[=v.spec.packages.length]}{[ } ]}</td>
          <td>{[if (v.spec.executors) { ]}{[=v.spec.executors.length]}{[ } ]}</td>
          <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </div>
</div>
{[?]}


