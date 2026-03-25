// !
// Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
// MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
//

function Voronoi() {
  this.vertices = null
  this.edges = null
  this.cells = null
  this.toRecycle = null
  this.beachsectionJunkyard = []
  this.circleEventJunkyard = []
  this.vertexJunkyard = []
  this.edgeJunkyard = []
  this.cellJunkyard = []
}

Voronoi.prototype.reset = function () {
  if (!this.beachline) {
    this.beachline = new this.RBTree()
  }
  if (this.beachline.root) {
    let a = this.beachline.getFirst(this.beachline.root)
    while (a) {
      this.beachsectionJunkyard.push(a)
      a = a.rbNext
    }
  }
  this.beachline.root = null
  if (!this.circleEvents) {
    this.circleEvents = new this.RBTree()
  }
  this.circleEvents.root = null
  this.firstCircleEvent = null
  this.vertices = []
  this.edges = []
  this.cells = []
}

Voronoi.prototype.sqrt = Math.sqrt
Voronoi.prototype.abs = Math.abs
Voronoi.prototype.ε = Voronoi.ε = 1e-9

Voronoi.prototype.invε = Voronoi.invε = 1 / Voronoi.ε

Voronoi.prototype.equalWithEpsilon = function (d, c) {
  return this.abs(d - c) < 1e-9
}

Voronoi.prototype.greaterThanWithEpsilon = function (d, c) {
  return d - c > 1e-9
}

Voronoi.prototype.greaterThanOrEqualWithEpsilon = function (d, c) {
  return c - d < 1e-9
}

Voronoi.prototype.lessThanWithEpsilon = function (d, c) {
  return c - d > 1e-9
}

Voronoi.prototype.lessThanOrEqualWithEpsilon = function (d, c) {
  return d - c < 1e-9
}

Voronoi.prototype.RBTree = function () {
  this.root = null
}

Voronoi.prototype.RBTree.prototype.rbInsertSuccessor = function (e, a) {
  let d
  if (e) {
    a.rbPrevious = e; a.rbNext = e.rbNext; if (e.rbNext) {
      e.rbNext.rbPrevious = a
    }e.rbNext = a; if (e.rbRight) {
      e = e.rbRight; while (e.rbLeft) {
        e = e.rbLeft
      }e.rbLeft = a
    } else {
      e.rbRight = a
    }d = e
  } else if (this.root) {
    e = this.getFirst(this.root); a.rbPrevious = null; a.rbNext = e; e.rbPrevious = a
    e.rbLeft = a; d = e
  } else {
    a.rbPrevious = a.rbNext = null; this.root = a; d = null
  }a.rbLeft = a.rbRight = null; a.rbParent = d; a.rbRed = true; let c; let b
  e = a; while (d && d.rbRed) {
    c = d.rbParent; if (d === c.rbLeft) {
      b = c.rbRight; if (b && b.rbRed) {
        d.rbRed = b.rbRed = false; c.rbRed = true; e = c
      } else {
        if (e === d.rbRight) {
          this.rbRotateLeft(d)
          e = d; d = e.rbParent
        }d.rbRed = false; c.rbRed = true; this.rbRotateRight(c)
      }
    } else {
      b = c.rbLeft; if (b && b.rbRed) {
        d.rbRed = b.rbRed = false; c.rbRed = true
        e = c
      } else {
        if (e === d.rbLeft) {
          this.rbRotateRight(d); e = d; d = e.rbParent
        }d.rbRed = false; c.rbRed = true; this.rbRotateLeft(c)
      }
    }d = e.rbParent
  } this.root.rbRed = false
}

Voronoi.prototype.RBTree.prototype.rbRemoveNode = function (f) {
  if (f.rbNext) {
    f.rbNext.rbPrevious = f.rbPrevious
  } if (f.rbPrevious) {
    f.rbPrevious.rbNext = f.rbNext
  }f.rbNext = f.rbPrevious = null; let e = f.rbParent; const g = f.rbLeft; const b = f.rbRight; let d; if (!g) {
    d = b
  } else if (!b) {
    d = g
  } else {
    d = this.getFirst(b)
  } if (e) {
    if (e.rbLeft === f) {
      e.rbLeft = d
    } else {
      e.rbRight = d
    }
  } else {
    this.root = d
  } let a; if (g && b) {
    a = d.rbRed
    d.rbRed = f.rbRed; d.rbLeft = g; g.rbParent = d; if (d !== b) {
      e = d.rbParent; d.rbParent = f.rbParent; f = d.rbRight; e.rbLeft = f; d.rbRight = b; b.rbParent = d
    } else {
      d.rbParent = e; e = d; f = d.rbRight
    }
  } else {
    a = f.rbRed; f = d
  } if (f) {
    f.rbParent = e
  } if (a) {
    return
  } if (f && f.rbRed) {
    f.rbRed = false; return
  } let c; do {
    if (f === this.root) {
      break
    } if (f === e.rbLeft) {
      c = e.rbRight; if (c.rbRed) {
        c.rbRed = false; e.rbRed = true; this.rbRotateLeft(e)
        c = e.rbRight
      } if ((c.rbLeft && c.rbLeft.rbRed) || (c.rbRight && c.rbRight.rbRed)) {
        if (!c.rbRight || !c.rbRight.rbRed) {
          c.rbLeft.rbRed = false
          c.rbRed = true; this.rbRotateRight(c); c = e.rbRight
        }c.rbRed = e.rbRed; e.rbRed = c.rbRight.rbRed = false; this.rbRotateLeft(e); f = this.root
        break
      }
    } else {
      c = e.rbLeft; if (c.rbRed) {
        c.rbRed = false; e.rbRed = true; this.rbRotateRight(e); c = e.rbLeft
      } if ((c.rbLeft && c.rbLeft.rbRed) || (c.rbRight && c.rbRight.rbRed)) {
        if (!c.rbLeft || !c.rbLeft.rbRed) {
          c.rbRight.rbRed = false
          c.rbRed = true; this.rbRotateLeft(c); c = e.rbLeft
        }c.rbRed = e.rbRed; e.rbRed = c.rbLeft.rbRed = false; this.rbRotateRight(e); f = this.root
        break
      }
    }c.rbRed = true; f = e; e = e.rbParent
  } while (!f.rbRed);if (f) {
    f.rbRed = false
  }
}

Voronoi.prototype.RBTree.prototype.rbRotateLeft = function (b) {
  const d = b; const c = b.rbRight; const a = d.rbParent
  if (a) {
    if (a.rbLeft === d) {
      a.rbLeft = c
    } else {
      a.rbRight = c
    }
  } else {
    this.root = c
  }c.rbParent = a; d.rbParent = c; d.rbRight = c.rbLeft; if (d.rbRight) {
    d.rbRight.rbParent = d
  }c.rbLeft = d
}

Voronoi.prototype.RBTree.prototype.rbRotateRight = function (b) {
  const d = b; const c = b.rbLeft; const a = d.rbParent; if (a) {
    if (a.rbLeft === d) {
      a.rbLeft = c
    } else {
      a.rbRight = c
    }
  } else {
    this.root = c
  }c.rbParent = a; d.rbParent = c; d.rbLeft = c.rbRight; if (d.rbLeft) {
    d.rbLeft.rbParent = d
  }c.rbRight = d
}

Voronoi.prototype.RBTree.prototype.getFirst = function (a) {
  while (a.rbLeft) {
    a = a.rbLeft
  } return a
}

Voronoi.prototype.RBTree.prototype.getLast = function (a) {
  while (a.rbRight) {
    a = a.rbRight
  } return a
}

Voronoi.prototype.Diagram = function (a) {
  this.site = a
}

Voronoi.prototype.Cell = function (a) {
  this.site = a; this.halfedges = []
  this.closeMe = false
}

Voronoi.prototype.Cell.prototype.init = function (a) {
  this.site = a; this.halfedges = []; this.closeMe = false; return this
}

Voronoi.prototype.createCell = function (b) {
  const a = this.cellJunkyard.pop(); if (a) {
    return a.init(b)
  } return new this.Cell(b)
}

Voronoi.prototype.Cell.prototype.prepareHalfedges = function () {
  const a = this.halfedges; let b = a.length; let c; while (b--) {
    c = a[b].edge; if (!c.vb || !c.va) {
      a.splice(b, 1)
    }
  }a.sort((e, d) => d.angle - e.angle); return a.length
}

Voronoi.prototype.Cell.prototype.getNeighborIds = function () {
  const a = []; let b = this.halfedges.length; let c
  while (b--) {
    c = this.halfedges[b].edge; if (c.lSite !== null && c.lSite.voronoiId != this.site.voronoiId) {
      a.push(c.lSite.voronoiId)
    } else if (c.rSite !== null && c.rSite.voronoiId != this.site.voronoiId) {
      a.push(c.rSite.voronoiId)
    }
  } return a
}

Voronoi.prototype.Cell.prototype.getBbox = function () {
  const i = this.halfedges; let d = i.length; let a = Infinity; let g = Infinity; let c = -Infinity; let b = -Infinity; let h; let f; let e
  while (d--) {
    h = i[d].getStartpoint(); f = h.x; e = h.y; if (f < a) {
      a = f
    } if (e < g) {
      g = e
    } if (f > c) {
      c = f
    } if (e > b) {
      b = e
    }
  } return {x: a, y: g, width: c - a, height: b - g}
}

Voronoi.prototype.Cell.prototype.pointIntersection = function (a, h) {
  const b = this.halfedges; let c = b.length; let f; let g; let e; let d; while (c--) {
    f = b[c]
    g = f.getStartpoint(); e = f.getEndpoint(); d = (h - g.y) * (e.x - g.x) - (a - g.x) * (e.y - g.y); if (!d) {
      return 0
    } if (d > 0) {
      return -1
    }
  } return 1
}

Voronoi.prototype.Vertex = function (a, b) {
  this.x = a; this.y = b
}

Voronoi.prototype.Edge = function (b, a) {
  this.lSite = b; this.rSite = a
  this.va = this.vb = null
}

Voronoi.prototype.Halfedge = function (d, e, a) {
  this.site = e; this.edge = d; if (a) {
    this.angle = Math.atan2(a.y - e.y, a.x - e.x)
  } else {
    const c = d.va; const b = d.vb; this.angle = d.lSite === e ? Math.atan2(b.x - c.x, c.y - b.y) : Math.atan2(c.x - b.x, b.y - c.y)
  }
}

Voronoi.prototype.createHalfedge = function (b, c, a) {
  return new this.Halfedge(b, c, a)
}

Voronoi.prototype.Halfedge.prototype.getStartpoint = function () {
  return this.edge.lSite === this.site ? this.edge.va : this.edge.vb
}

Voronoi.prototype.Halfedge.prototype.getEndpoint = function () {
  return this.edge.lSite === this.site ? this.edge.vb : this.edge.va
}

Voronoi.prototype.createVertex = function (a, c) {
  let b = this.vertexJunkyard.pop(); if (!b) {
    b = new this.Vertex(a, c)
  } else {
    b.x = a; b.y = c
  } this.vertices.push(b); return b
}

Voronoi.prototype.createEdge = function (e, a, d, b) {
  let c = this.edgeJunkyard.pop(); if (!c) {
    c = new this.Edge(e, a)
  } else {
    c.lSite = e; c.rSite = a; c.va = c.vb = null
  } this.edges.push(c); if (d) {
    this.setEdgeStartpoint(c, e, a, d)
  } if (b) {
    this.setEdgeEndpoint(c, e, a, b)
  }
  this.cells[e.voronoiId].halfedges.push(this.createHalfedge(c, e, a)); this.cells[a.voronoiId].halfedges.push(this.createHalfedge(c, a, e))
  return c
}

Voronoi.prototype.createBorderEdge = function (d, c, a) {
  let b = this.edgeJunkyard.pop(); if (!b) {
    b = new this.Edge(d, null)
  } else {
    b.lSite = d; b.rSite = null
  }b.va = c; b.vb = a; this.edges.push(b); return b
}

Voronoi.prototype.setEdgeStartpoint = function (b, d, a, c) {
  if (!b.va && !b.vb) {
    b.va = c
    b.lSite = d; b.rSite = a
  } else if (b.lSite === a) {
    b.vb = c
  } else {
    b.va = c
  }
}

Voronoi.prototype.setEdgeEndpoint = function (b, d, a, c) {
  this.setEdgeStartpoint(b, a, d, c)
}

Voronoi.prototype.Beachsection = function () {}; Voronoi.prototype.createBeachsection = function (a) {
  let b = this.beachsectionJunkyard.pop()
  if (!b) {
    b = new this.Beachsection()
  }b.site = a; return b
}

Voronoi.prototype.leftBreakPoint = function (e, f) {
  let a = e.site; const m = a.x; const l = a.y; const k = l - f
  if (!k) {
    return m
  } const n = e.rbPrevious; if (!n) {
    return -Infinity
  }a = n.site; const h = a.x; const g = a.y; const d = g - f; if (!d) {
    return h
  } const c = h - m; const j = 1 / k - 1 / d; const i = c / d
  if (j) {
    return (-i + this.sqrt(i * i - 2 * j * (c * c / (-2 * d) - g + d / 2 + l - k / 2))) / j + m
  } return (m + h) / 2
}

Voronoi.prototype.rightBreakPoint = function (b, c) {
  const d = b.rbNext
  if (d) {
    return this.leftBreakPoint(d, c)
  } const a = b.site; return a.y === c ? a.x : Infinity
}

Voronoi.prototype.detachBeachsection = function (a) {
  this.detachCircleEvent(a)
  this.beachline.rbRemoveNode(a); this.beachsectionJunkyard.push(a)
}

Voronoi.prototype.removeBeachsection = function (b) {
  const a = b.circleEvent; const j = a.x; const h = a.ycenter; const e = this.createVertex(j, h); let f = b.rbPrevious; let d = b.rbNext; const l = [b]; const g = Math.abs
  this.detachBeachsection(b); let m = f; while (m.circleEvent && g(j - m.circleEvent.x) < 1e-9 && g(h - m.circleEvent.ycenter) < 1e-9) {
    f = m.rbPrevious
    l.unshift(m); this.detachBeachsection(m); m = f
  }l.unshift(m); this.detachCircleEvent(m); let c = d; while (c.circleEvent && g(j - c.circleEvent.x) < 1e-9 && g(h - c.circleEvent.ycenter) < 1e-9) {
    d = c.rbNext
    l.push(c); this.detachBeachsection(c); c = d
  }l.push(c); this.detachCircleEvent(c); const k = l.length; let i; for (i = 1; i < k; i++) {
    c = l[i]; m = l[i - 1]
    this.setEdgeStartpoint(c.edge, m.site, c.site, e)
  }m = l[0]; c = l[k - 1]; c.edge = this.createEdge(m.site, c.site, undefined, e); this.attachCircleEvent(m)
  this.attachCircleEvent(c)
}

Voronoi.prototype.addBeachsection = function (l) {
  const j = l.x; const n = l.y; let p; let m; let v; let q; let o = this.beachline.root
  while (o) {
    v = this.leftBreakPoint(o, n) - j; if (v > 1e-9) {
      o = o.rbLeft
    } else {
      q = j - this.rightBreakPoint(o, n); if (q > 1e-9) {
        if (!o.rbRight) {
          p = o
          break
        }o = o.rbRight
      } else {
        if (v > -1e-9) {
          p = o.rbPrevious; m = o
        } else if (q > -1e-9) {
          p = o; m = o.rbNext
        } else {
          p = m = o
        } break
      }
    }
  }

  const e = this.createBeachsection(l)
  this.beachline.rbInsertSuccessor(p, e); if (!p && !m) {
    return
  } if (p === m) {
    this.detachCircleEvent(p); m = this.createBeachsection(p.site)
    this.beachline.rbInsertSuccessor(e, m); e.edge = m.edge = this.createEdge(p.site, e.site); this.attachCircleEvent(p); this.attachCircleEvent(m)
    return
  } if (p && !m) {
    e.edge = this.createEdge(p.site, e.site); return
  } if (p !== m) {
    this.detachCircleEvent(p); this.detachCircleEvent(m)
    const h = p.site; const k = h.x; const i = h.y; const t = l.x - k; const r = l.y - i; const a = m.site; const c = a.x - k; const b = a.y - i; const u = 2 * (t * b - r * c); const g = t * t + r * r; const f = c * c + b * b; const s = this.createVertex((b * g - r * f) / u + k, (t * f - c * g) / u + i)
    this.setEdgeStartpoint(m.edge, h, a, s); e.edge = this.createEdge(h, l, undefined, s); m.edge = this.createEdge(l, a, undefined, s); this.attachCircleEvent(p)
    this.attachCircleEvent(m)
  }
}

Voronoi.prototype.CircleEvent = function () {
  this.arc = null; this.rbLeft = null; this.rbNext = null
  this.rbParent = null; this.rbPrevious = null; this.rbRed = false; this.rbRight = null; this.site = null; this.x = this.y = this.ycenter = 0
}

Voronoi.prototype.attachCircleEvent = function (i) {
  const r = i.rbPrevious; const o = i.rbNext
  if (!r || !o) {
    return
  } const k = r.site; const u = i.site; const c = o.site; if (k === c) {
    return
  } const t = u.x; const s = u.y; const n = k.x - t; const l = k.y - s; const f = c.x - t; const e = c.y - s; const v = 2 * (n * e - l * f)
  if (v >= -2e-12) {
    return
  } const h = n * n + l * l; const g = f * f + e * e; const m = (e * h - l * g) / v; const j = (n * g - f * h) / v; const b = j + s; let q = this.circleEventJunkyard.pop(); if (!q) {
    q = new this.CircleEvent()
  }q.arc = i; q.site = u; q.x = m + t; q.y = b + this.sqrt(m * m + j * j); q.ycenter = b; i.circleEvent = q; let a = null; let p = this.circleEvents.root; while (p) {
    if (q.y < p.y || (q.y === p.y && q.x <= p.x)) {
      if (p.rbLeft) {
        p = p.rbLeft
      } else {
        a = p.rbPrevious; break
      }
    } else if (p.rbRight) {
      p = p.rbRight
    } else {
      a = p; break
    }
  } this.circleEvents.rbInsertSuccessor(a, q); if (!a) {
    this.firstCircleEvent = q
  }
}

Voronoi.prototype.detachCircleEvent = function (b) {
  const a = b.circleEvent; if (a) {
    if (!a.rbPrevious) {
      this.firstCircleEvent = a.rbNext
    } this.circleEvents.rbRemoveNode(a); this.circleEventJunkyard.push(a); b.circleEvent = null
  }
}

Voronoi.prototype.connectEdge = function (l, a) {
  let b = l.vb
  if (b) {
    return true
  } let c = l.va; const p = a.xl; const n = a.xr; const r = a.yt; const d = a.yb; const o = l.lSite; const e = l.rSite; const i = o.x; const h = o.y; const k = e.x; const j = e.y; const g = (i + k) / 2; const f = (h + j) / 2; let m; let q
  this.cells[o.voronoiId].closeMe = true; this.cells[e.voronoiId].closeMe = true; if (j !== h) {
    m = (i - k) / (j - h); q = f - m * g
  } if (m === undefined) {
    if (g < p || g >= n) {
      return false
    } if (i > k) {
      if (!c || c.y < r) {
        c = this.createVertex(g, r)
      } else if (c.y >= d) {
        return false
      }b = this.createVertex(g, d)
    } else {
      if (!c || c.y > d) {
        c = this.createVertex(g, d)
      } else if (c.y < r) {
        return false
      }b = this.createVertex(g, r)
    }
  } else if (m < -1 || m > 1) {
    if (i > k) {
      if (!c || c.y < r) {
        c = this.createVertex((r - q) / m, r)
      } else if (c.y >= d) {
        return false
      }b = this.createVertex((d - q) / m, d)
    } else {
      if (!c || c.y > d) {
        c = this.createVertex((d - q) / m, d)
      } else if (c.y < r) {
        return false
      }b = this.createVertex((r - q) / m, r)
    }
  } else if (h < j) {
    if (!c || c.x < p) {
      c = this.createVertex(p, m * p + q)
    } else if (c.x >= n) {
      return false
    }b = this.createVertex(n, m * n + q)
  } else {
    if (!c || c.x > n) {
      c = this.createVertex(n, m * n + q)
    } else if (c.x < p) {
      return false
    }b = this.createVertex(p, m * p + q)
  }l.va = c; l.vb = b
  return true
}

Voronoi.prototype.clipEdge = function (d, i) {
  const b = d.va.x; const l = d.va.y; const h = d.vb.x; const g = d.vb.y; let f = 0; let e = 1; const k = h - b; const j = g - l; let c = b - i.xl
  if (k === 0 && c < 0) {
    return false
  } let a = -c / k; if (k < 0) {
    if (a < f) {
      return false
    } if (a < e) {
      e = a
    }
  } else if (k > 0) {
    if (a > e) {
      return false
    } if (a > f) {
      f = a
    }
  }c = i.xr - b; if (k === 0 && c < 0) {
    return false
  }a = c / k; if (k < 0) {
    if (a > e) {
      return false
    } if (a > f) {
      f = a
    }
  } else if (k > 0) {
    if (a < f) {
      return false
    } if (a < e) {
      e = a
    }
  }c = l - i.yt; if (j === 0 && c < 0) {
    return false
  }a = -c / j; if (j < 0) {
    if (a < f) {
      return false
    } if (a < e) {
      e = a
    }
  } else if (j > 0) {
    if (a > e) {
      return false
    } if (a > f) {
      f = a
    }
  }c = i.yb - l; if (j === 0 && c < 0) {
    return false
  }a = c / j; if (j < 0) {
    if (a > e) {
      return false
    } if (a > f) {
      f = a
    }
  } else if (j > 0) {
    if (a < f) {
      return false
    } if (a < e) {
      e = a
    }
  } if (f > 0) {
    d.va = this.createVertex(b + f * k, l + f * j)
  } if (e < 1) {
    d.vb = this.createVertex(b + e * k, l + e * j)
  } if (f > 0 || e < 1) {
    this.cells[d.lSite.voronoiId].closeMe = true
    this.cells[d.rSite.voronoiId].closeMe = true
  } return true
}

Voronoi.prototype.clipEdges = function (e) {
  const a = this.edges; let d = a.length; let c; const b = Math.abs
  while (d--) {
    c = a[d]; if (!this.connectEdge(c, e) || !this.clipEdge(c, e) || (b(c.va.x - c.vb.x) < 1e-9 && b(c.va.y - c.vb.y) < 1e-9)) {
      c.va = c.vb = null
      a.splice(d, 1)
    }
  }
}

Voronoi.prototype.closeCells = function (p) {
  const g = p.xl; const d = p.xr; const m = p.yt; const j = p.yb; const q = this.cells; let a = q.length; let n; let e; let o; let c; let b; let l; let k; let i; let f; const h = Math.abs
  while (a--) {
    n = q[a]; if (!n.prepareHalfedges()) {
      continue
    } if (!n.closeMe) {
      continue
    }o = n.halfedges; c = o.length; e = 0; while (e < c) {
      l = o[e].getEndpoint()
      i = o[(e + 1) % c].getStartpoint(); if (h(l.x - i.x) >= 1e-9 || h(l.y - i.y) >= 1e-9) {
        switch (true) {
          case this.equalWithEpsilon(l.x, g) && this.lessThanWithEpsilon(l.y, j): f = this.equalWithEpsilon(i.x, g)
            k = this.createVertex(g, f ? i.y : j); b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++
            if (f) {
              break
            }l = k; case this.equalWithEpsilon(l.y, j) && this.lessThanWithEpsilon(l.x, d): f = this.equalWithEpsilon(i.y, j); k = this.createVertex(f ? i.x : d, j)
            b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++; if (f) {
              break
            }l = k; case this.equalWithEpsilon(l.x, d) && this.greaterThanWithEpsilon(l.y, m): f = this.equalWithEpsilon(i.x, d)
            k = this.createVertex(d, f ? i.y : m); b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++
            if (f) {
              break
            }l = k; case this.equalWithEpsilon(l.y, m) && this.greaterThanWithEpsilon(l.x, g): f = this.equalWithEpsilon(i.y, m); k = this.createVertex(f ? i.x : g, m)
            b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++; if (f) {
              break
            }l = k; f = this.equalWithEpsilon(i.x, g)
            k = this.createVertex(g, f ? i.y : j); b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++
            if (f) {
              break
            }l = k; f = this.equalWithEpsilon(i.y, j); k = this.createVertex(f ? i.x : d, j); b = this.createBorderEdge(n.site, l, k); e++; o.splice(e, 0, this.createHalfedge(b, n.site, null))
            c++; if (f) {
              break
            }l = k; f = this.equalWithEpsilon(i.x, d); k = this.createVertex(d, f ? i.y : m); b = this.createBorderEdge(n.site, l, k); e++
            o.splice(e, 0, this.createHalfedge(b, n.site, null)); c++; if (f) {
              break
            } default: throw 'Voronoi.closeCells() > this makes no sense!'
        }
      }e++
    }n.closeMe = false
  }
}

Voronoi.prototype.quantizeSites = function (c) {
  const b = this.ε; let d = c.length; let a; while (d--) {
    a = c[d]; a.x = Math.floor(a.x / b) * b
    a.y = Math.floor(a.y / b) * b
  }
}

Voronoi.prototype.recycle = function (a) {
  if (a) {
    if (a instanceof this.Diagram) {
      this.toRecycle = a
    } else {
      throw 'Voronoi.recycleDiagram() > Need a Diagram object.'
    }
  }
}

Voronoi.prototype.compute = function (i, j) {
  const d = new Date(); this.reset(); if (this.toRecycle) {
    this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices)
    this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges)
    this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells)
    this.toRecycle = null
  } const h = i.slice(0); h.sort((n, m) => {
    const o = m.y - n.y; if (o) {
      return o
    } return m.x - n.x
  }); let b = h.pop(); let l = 0; let f; let e; const k = this.cells; let a
  for (;;) {
    a = this.firstCircleEvent; if (b && (!a || b.y < a.y || (b.y === a.y && b.x < a.x))) {
      if (b.x !== f || b.y !== e) {
        k[l] = this.createCell(b); b.voronoiId = l++
        this.addBeachsection(b); e = b.y; f = b.x
      }b = h.pop()
    } else if (a) {
      this.removeBeachsection(a.arc)
    } else {
      break
    }
  } this.clipEdges(j); this.closeCells(j)
  const c = new Date()
  const g = new this.Diagram()
  g.cells = this.cells; g.edges = this.edges
  g.vertices = this.vertices
  g.execTime = c.getTime() - d.getTime()
  this.reset(); return g
}

function distance(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function cellArea(cell) {
  let area = 0
  const {halfedges} = cell
  let iHalfedge = halfedges.length
  let halfedge
  let p1
  let p2
  while (iHalfedge--) {
    halfedge = halfedges[iHalfedge]
    p1 = halfedge.getStartpoint()
    p2 = halfedge.getEndpoint()
    area += p1.x * p2.y
    area -= p1.y * p2.x
  }
  area /= 2
  return area
}

function cellCentroid(cell) {
  let x = 0
  let y = 0
  const {halfedges} = cell
  let iHalfedge = halfedges.length
  let halfedge
  let v
  let p1
  let p2
  while (iHalfedge--) {
    halfedge = halfedges[iHalfedge]
    p1 = halfedge.getStartpoint()
    p2 = halfedge.getEndpoint()
    v = p1.x * p2.y - p2.x * p1.y
    x += (p1.x + p2.x) * v
    y += (p1.y + p2.y) * v
  }
  v = cellArea(cell) * 6
  return {x: x / v, y: y / v}
}

function relaxCells(cells) {
  let iCell = cells.length
  let cell
  let site
  const sites = []
  let again = false
  let rn
  let dist
  const p = (1 / iCell) * 0.1
  while (iCell--) {
    cell = cells[iCell]
    rn = Math.random()
    // probability of apoptosis
    if (rn < p) {
      continue  // eslint-disable-line no-continue
    }
    site = cellCentroid(cell)
    dist = distance(site, cell.site)
    again = again || dist > 1
    // don't relax too fast
    if (dist > 2) {
      site.x = (site.x + cell.site.x) / 2
      site.y = (site.y + cell.site.y) / 2
    }
    // probability of mytosis
    if (rn > 1 - p) {
      dist /= 2
      sites.push({
        x: site.x + (site.x - cell.site.x) / dist,
        y: site.y + (site.y - cell.site.y) / dist,
      })
    }
    sites.push(site)
  }
  return sites
}

export {Voronoi, relaxCells, distance, cellCentroid}
